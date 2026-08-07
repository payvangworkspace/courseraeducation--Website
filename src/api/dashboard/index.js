import { merchantApi } from "../merchant";
import { paymentApi } from "../payment";
import { walletApi } from "../wallet";
import { unwrapList } from "../client/apiClient";

function toNumber(value) {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const cleaned = String(value).replace(/[₹,\s]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function txnAmount(txn) {
  return toNumber(txn.txnAmt ?? txn.amount ?? txn.txnAmount ?? txn.totalAmount);
}

function txnFee(txn) {
  return toNumber(txn.fee ?? txn.txnFee ?? txn.merchantCharge ?? txn.charges);
}

function txnStatus(txn) {
  return String(txn.status ?? txn.txnStatus ?? "").toLowerCase();
}

function txnDate(txn) {
  const raw = txn.createdOn || txn.createdDate || txn.date || txn.txnDate;
  const d = raw ? new Date(raw) : null;
  return d && !Number.isNaN(d.getTime()) ? d : null;
}

function isToday(date) {
  if (!date) return false;
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function dayKey(date) {
  return date.toISOString().slice(0, 10);
}

function formatDayLabel(date) {
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function lastNDays(n) {
  const days = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(now.getDate() - i);
    days.push(d);
  }
  return days;
}

function isSuccess(status) {
  return ["success", "successful", "captured", "paid", "completed", "settled"].includes(status);
}

function isPending(status) {
  return ["pending", "processing", "initiated", "inprogress", "in_progress"].includes(status);
}

function isRefund(status) {
  return ["refund", "refunded", "partial_refund", "chargeback"].includes(status);
}

function sparklineFromDaily(dailyMap, days, picker) {
  return days.map((d) => picker(dailyMap.get(dayKey(d)) || { amount: 0, count: 0, fees: 0 }));
}

function buildDailyBuckets(txns, days) {
  const map = new Map(
    days.map((d) => [
      dayKey(d),
      { amount: 0, count: 0, fees: 0, success: 0, refund: 0, pending: 0 },
    ])
  );

  txns.forEach((txn) => {
    const date = txnDate(txn);
    if (!date) return;
    const bucket = map.get(dayKey(date));
    if (!bucket) return;

    const amount = txnAmount(txn);
    const status = txnStatus(txn);
    bucket.amount += amount;
    bucket.count += 1;
    bucket.fees += txnFee(txn);
    if (isSuccess(status)) bucket.success += amount;
    if (isRefund(status)) bucket.refund += amount;
    if (isPending(status)) bucket.pending += amount;
  });

  return map;
}

function roleOf(user) {
  return String(user.role || user.userRole || user.roleName || "").toUpperCase();
}

function formatINR(n) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

/**
 * Dashboard stats from live Swagger APIs only:
 * merchants, users, transactions, wallets.
 */
export async function getDashboardStats() {
  const [merchantsRes, usersRes, txnsRes, walletsRes] = await Promise.all([
    merchantApi.getAllMerchantList({ start: 0, size: 1000 }),
    merchantApi.getAllUsers({ start: 0, size: 1000 }),
    paymentApi.getAllTransactions({ start: 0, size: 1000 }),
    walletApi.getWalletList(),
  ]);

  const merchants = unwrapList(merchantsRes);
  const users = unwrapList(usersRes);
  const txns = unwrapList(txnsRes);
  const wallets = unwrapList(walletsRes);

  const days7 = lastNDays(7);
  const daily = buildDailyBuckets(txns, days7);

  const todayTxns = txns.filter((t) => isToday(txnDate(t)));
  const todayTxnAmount = todayTxns.reduce((sum, t) => sum + txnAmount(t), 0);
  const todayTxnCount = todayTxns.length;
  const txnFees = todayTxns.reduce((sum, t) => sum + txnFee(t), 0);

  const successTxns = txns.filter((t) => isSuccess(txnStatus(t)));
  const refundTxns = txns.filter((t) => isRefund(txnStatus(t)));
  const pendingTxns = txns.filter((t) => isPending(txnStatus(t)));

  const successAmount = successTxns.reduce((sum, t) => sum + txnAmount(t), 0);
  const refundAmount = refundTxns.reduce((sum, t) => sum + txnAmount(t), 0);
  const pendingAmount = pendingTxns.reduce((sum, t) => sum + txnAmount(t), 0);
  const grossAmount = successAmount + refundAmount + pendingAmount;
  const pct = (part) => (grossAmount > 0 ? `${((part / grossAmount) * 100).toFixed(1)}%` : "0%");

  const weeklyPayoutAnalysis = days7.map((d) => {
    const bucket = daily.get(dayKey(d)) || { success: 0, refund: 0, amount: 0 };
    const toLakh = (v) => Number((v / 100000).toFixed(2));
    return {
      date: formatDayLabel(d),
      success: toLakh(bucket.success),
      refund: toLakh(bucket.refund),
      total: toLakh(bucket.amount),
    };
  });

  const refundByDay = days7.map((d) => {
    const key = dayKey(d);
    const dayRefunds = refundTxns.filter((t) => {
      const date = txnDate(t);
      return date && dayKey(date) === key;
    });
    return {
      day: d.toLocaleDateString("en-GB", { weekday: "short" }),
      amount: dayRefunds.reduce((sum, t) => sum + txnAmount(t), 0),
    };
  });

  const walletPayout = days7.map((d) => {
    const bucket = daily.get(dayKey(d)) || { success: 0, count: 0 };
    return {
      date: formatDayLabel(d),
      amount: Number((bucket.success / 100000).toFixed(2)),
      payoutCount: bucket.count,
    };
  });

  const walletBalance = wallets.reduce(
    (sum, w) => sum + toNumber(w.netBalance ?? w.balance ?? w.availableBalance ?? w.amount),
    0
  );

  const subAdmins = users.filter((u) => {
    const role = roleOf(u);
    return role.includes("ADMIN") && !role.includes("SUPER");
  }).length;

  const resellersCount = users.filter((u) => roleOf(u).includes("RESELLER")).length;
  const subMerchantsCount = users.filter((u) => {
    const role = roleOf(u);
    return role.includes("SUB") || role.includes("SUBMERCHANT");
  }).length;

  return {
    todayTxnAmount,
    todayTxnAmountSparkline: sparklineFromDaily(daily, days7, (b) => b.amount),
    todayTxnCount,
    todayTxnCountSparkline: sparklineFromDaily(daily, days7, (b) => b.count),
    txnFees,
    txnFeesSparkline: sparklineFromDaily(daily, days7, (b) => b.fees),
    subAdmins,
    merchantsCount: merchants.length,
    resellersCount,
    subMerchantsCount,
    weeklyPayoutAnalysis,
    totalTxnsDonut: [
      { name: "Success", value: successAmount, percentage: pct(successAmount), color: "#7A1F2B" },
      { name: "Refunded", value: refundAmount, percentage: pct(refundAmount), color: "#C99A3D" },
      { name: "Pending", value: pendingAmount, percentage: pct(pendingAmount), color: "#D97706" },
    ],
    grossAmount,
    settlementsMini: {
      amountPayable: successAmount,
      successTxns: successTxns.length,
      pendingTxns: pendingTxns.length,
    },
    refundsMini: {
      totalCount: refundTxns.length,
      totalAmount: refundAmount,
      data: refundByDay,
    },
    pendingOverview: {
      amount: pendingAmount,
      fee: pendingTxns.reduce((sum, t) => sum + txnFee(t), 0),
      count: pendingTxns.length,
    },
    totalWalletPayout: walletPayout,
    walletBalance,
  };
}

/**
 * Super-admin dashboard from live transaction + wallet APIs only.
 */
export async function getSuperAdminStats() {
  const [txnsRes, walletsRes] = await Promise.all([
    paymentApi.getAllTransactions({ start: 0, size: 1000 }),
    walletApi.getWalletList(),
  ]);

  const txns = unwrapList(txnsRes);
  const wallets = unwrapList(walletsRes);
  const days7 = lastNDays(7);
  const daily = buildDailyBuckets(txns, days7);

  const payinAmount = txns.reduce((sum, t) => sum + txnAmount(t), 0);
  const payoutAmount = txns
    .filter((t) => isSuccess(txnStatus(t)))
    .reduce((sum, t) => sum + txnAmount(t), 0);
  const walletAmount = wallets.reduce(
    (sum, w) => sum + toNumber(w.netBalance ?? w.balance ?? w.availableBalance ?? w.amount),
    0
  );
  const feesAmount = txns.reduce((sum, t) => sum + txnFee(t), 0);
  const refundAmount = txns
    .filter((t) => isRefund(txnStatus(t)))
    .reduce((sum, t) => sum + txnAmount(t), 0);
  const pendingAmount = txns
    .filter((t) => isPending(txnStatus(t)))
    .reduce((sum, t) => sum + txnAmount(t), 0);

  const weeklyAnalysis = days7.map((d) => {
    const bucket = daily.get(dayKey(d)) || { amount: 0, success: 0 };
    return {
      day: d.toLocaleDateString("en-GB", { weekday: "short" }),
      payin: Number((bucket.amount / 10000000).toFixed(2)),
      payout: Number((bucket.success / 10000000).toFixed(2)),
    };
  });

  const profitParts = [
    { name: "Txn Fees", value: feesAmount, color: "#7A1F2B" },
    { name: "Successful Volume", value: payoutAmount, color: "#C99A3D" },
    { name: "Wallet Balance", value: walletAmount, color: "#16a34a" },
  ];
  const profitTotal = profitParts.reduce((sum, p) => sum + p.value, 0);
  const profitsDonut = profitParts.map((p) => ({
    name: p.name,
    value: profitTotal > 0 ? Number(((p.value / profitTotal) * 100).toFixed(1)) : 0,
    color: p.color,
  }));

  const months = [];
  const now = new Date();
  for (let i = 6; i >= 0; i -= 1) {
    months.push(new Date(now.getFullYear(), now.getMonth() - i, 1));
  }

  const monthlyRevenueTrend = months.map((monthDate, idx) => {
    const monthTxns = txns.filter((t) => {
      const date = txnDate(t);
      return (
        date &&
        date.getFullYear() === monthDate.getFullYear() &&
        date.getMonth() === monthDate.getMonth()
      );
    });
    const revenue = monthTxns.reduce((sum, t) => sum + txnAmount(t), 0);
    let growth = 0;
    if (idx > 0) {
      const prev = months[idx - 1];
      const prevRevenue = txns
        .filter((t) => {
          const date = txnDate(t);
          return (
            date &&
            date.getFullYear() === prev.getFullYear() &&
            date.getMonth() === prev.getMonth()
          );
        })
        .reduce((sum, t) => sum + txnAmount(t), 0);
      growth =
        prevRevenue > 0
          ? Number((((revenue - prevRevenue) / prevRevenue) * 100).toFixed(1))
          : 0;
    }
    return {
      month: monthDate.toLocaleDateString("en-GB", { month: "short" }),
      revenue: Number((revenue / 10000000).toFixed(2)),
      growth,
    };
  });

  return {
    payin: {
      amount: formatINR(payinAmount),
      sparkline: sparklineFromDaily(daily, days7, (b) => Number((b.amount / 100000).toFixed(2))),
    },
    payout: {
      amount: formatINR(payoutAmount),
      sparkline: sparklineFromDaily(daily, days7, (b) => Number((b.success / 100000).toFixed(2))),
    },
    wallet: {
      amount: formatINR(walletAmount),
      sparkline: sparklineFromDaily(daily, days7, (b) => b.count),
    },
    weeklyAnalysis,
    profitsDonut,
    profitCenterTotal: formatINR(feesAmount),
    monthlyRevenueTrend,
    refundAmount,
    pendingAmount,
  };
}

export const dashboardApi = {
  getDashboardStats,
  getSuperAdminStats,
};

export default dashboardApi;
