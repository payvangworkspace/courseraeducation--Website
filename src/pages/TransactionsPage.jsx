import React, { useEffect, useState } from 'react';
import PayVangLayout from '../components/layout/PayVangLayout';
import StatCard from '../components/common/StatCard';
import { CreditCard, Download, Filter, RefreshCw, AlertCircle, Eye, CheckCircle2, XCircle, Clock, X } from 'lucide-react';
import { merchantApi, paymentApi, unwrapList } from '../api';

function toNumber(value) {
  if (value === null || value === undefined || value === '') return 0;
  const n = Number(String(value).replace(/[₹,\s]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function normalizeStatus(raw) {
  const s = String(raw || '').toLowerCase();
  if (['success', 'successful', 'captured', 'paid', 'completed', 'settled'].includes(s)) return 'Success';
  if (['failed', 'fail', 'declined', 'error'].includes(s)) return 'Failed';
  return 'Pending';
}

function normalizeTxn(t) {
  return {
    id: t.txnId || t.transactionId || t.orderId || t.id || '—',
    merchantId: t.merchantId || t.userId || '—',
    merchantName: t.merchantName || t.fullName || t.businessName || '—',
    status: normalizeStatus(t.status || t.txnStatus),
    customerName: t.customerName || t.name || '—',
    customerEmail: t.customerEmail || t.email || '—',
    txnAmt: toNumber(t.txnAmt ?? t.amount ?? t.txnAmount ?? t.totalAmount),
    currency: t.currency || t.currencyCode || 'INR',
    transactionType: t.transactionType || t.txnType || t.type || 'PAYIN',
    createdOn: t.createdOn || t.createdDate || t.date || t.txnDate || '—',
    raw: t,
  };
}

function buildStats(items) {
  const bucket = () => ({ count: 0, amount: 0 });
  const stats = { total: bucket(), success: bucket(), failed: bucket(), pending: bucket() };
  items.forEach((item) => {
    stats.total.count += 1;
    stats.total.amount += item.txnAmt;
    const key = item.status === 'Success' ? 'success' : item.status === 'Failed' ? 'failed' : 'pending';
    stats[key].count += 1;
    stats[key].amount += item.txnAmt;
  });
  return stats;
}

export default function TransactionsPage() {
  const [data, setData] = useState({ stats: null, items: [] });
  const [loading, setLoading] = useState(true);
  const [merchantsList, setMerchantsList] = useState([]);
  const [selectedTxnDetail, setSelectedTxnDetail] = useState(null);

  // Filters state
  const [merchant, setMerchant] = useState('ALL');
  const [currency, setCurrency] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Fetch Merchants for Filter
  useEffect(() => {
    merchantApi
      .getAllMerchantList({ start: 0, length: 1000 })
      .then((res) => {
        setMerchantsList(
          unwrapList(res).map((m) => ({
            id: m.userId || m.id || m.merchantId,
            name: m.fullName || m.name || m.businessName || m.userId || m.id,
          }))
        );
      })
      .catch((err) => console.error(err));
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await paymentApi.getAllTransactions({
        start: 0,
        length: 1000,
        merchantId: merchant === 'ALL' ? undefined : merchant,
        currency: currency === 'ALL' ? undefined : currency,
        status: status === 'ALL' ? undefined : status,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });

      let items = unwrapList(res).map(normalizeTxn);

      if (merchant !== 'ALL') items = items.filter((t) => String(t.merchantId) === String(merchant));
      if (currency !== 'ALL') items = items.filter((t) => String(t.currency).toUpperCase() === currency);
      if (status !== 'ALL') items = items.filter((t) => t.status === status);
      if (dateFrom) {
        const from = new Date(dateFrom);
        items = items.filter((t) => {
          const d = new Date(t.createdOn);
          return Number.isNaN(d.getTime()) || d >= from;
        });
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        items = items.filter((t) => {
          const d = new Date(t.createdOn);
          return Number.isNaN(d.getTime()) || d <= to;
        });
      }

      setData({ stats: buildStats(items), items });
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setData({ stats: buildStats([]), items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [merchant, currency, status, dateFrom, dateTo]);

  // Export to CSV Function
  const exportToCSV = () => {
    if (!data.items || data.items.length === 0) {
      alert('No transaction records available to export.');
      return;
    }
    const headers = ['Txn ID', 'Merchant ID', 'Merchant Name', 'Status', 'Customer Name', 'Customer Email', 'Amount', 'Currency', 'Type', 'Created On'];
    const csvRows = [headers.join(',')];
    data.items.forEach((item) => {
      csvRows.push([
        item.id,
        item.merchantId,
        `"${item.merchantName}"`,
        item.status,
        `"${item.customerName}"`,
        item.customerEmail,
        item.txnAmt,
        item.currency,
        item.transactionType,
        `"${item.createdOn}"`
      ].join(','));
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PayVang_Transactions_Export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Success':
        return 'coursera-badge-green';
      case 'Failed':
        return 'coursera-badge-red';
      case 'Pending':
      default:
        return 'coursera-badge-gold';
    }
  };

  return (
    <PayVangLayout title="Payin - Transactions" subtitle="Live acquiring payment ledger, customer checkout sessions & audit trail.">
      <div className="space-y-6">
        {/* FILTER BAR */}
        <div className="coursera-card p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#7A1F2B]">
            <Filter className="w-4 h-4 text-[#C99A3D]" />
            Payin Ledger Filters
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            {/* Merchant Dropdown */}
            <div>
              <label className="block text-[#6b5a56] font-semibold mb-1">Merchant</label>
              <select
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                className="w-full bg-[#FAF2E8] border border-[#7A1F2B]/15 text-[#241417] rounded-xl px-3 py-2 outline-none font-medium"
              >
                <option value="ALL">All Merchants</option>
                {merchantsList.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            {/* Currency Dropdown */}
            <div>
              <label className="block text-[#6b5a56] font-semibold mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-[#FAF2E8] border border-[#7A1F2B]/15 text-[#241417] rounded-xl px-3 py-2 outline-none font-medium"
              >
                <option value="ALL">All Currencies</option>
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-[#6b5a56] font-semibold mb-1">Date From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full bg-[#FAF2E8] border border-[#7A1F2B]/15 text-[#241417] rounded-xl px-3 py-2 outline-none font-medium"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-[#6b5a56] font-semibold mb-1">Date To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full bg-[#FAF2E8] border border-[#7A1F2B]/15 text-[#241417] rounded-xl px-3 py-2 outline-none font-medium"
              />
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="block text-[#6b5a56] font-semibold mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-[#FAF2E8] border border-[#7A1F2B]/15 text-[#241417] rounded-xl px-3 py-2 outline-none font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="Success">Success</option>
                <option value="Failed">Failed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4 STAT CARDS: TOTAL / SUCCESS / FAILED / PENDING */}
        {data.stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Transactions"
              value={data.stats.total.count}
              badgeText={`₹${data.stats.total.amount.toLocaleString('en-IN')}`}
              badgeType="maroon"
            />
            <StatCard
              title="Success Txns"
              value={data.stats.success.count}
              badgeText={`₹${data.stats.success.amount.toLocaleString('en-IN')}`}
              badgeType="green"
            />
            <StatCard
              title="Failed Txns"
              value={data.stats.failed.count}
              badgeText={`₹${data.stats.failed.amount.toLocaleString('en-IN')}`}
              badgeType="red"
            />
            <StatCard
              title="Pending Txns"
              value={data.stats.pending.count}
              badgeText={`₹${data.stats.pending.amount.toLocaleString('en-IN')}`}
              badgeType="gold"
            />
          </div>
        )}

        {/* TRANSACTIONS TABLE WITH EXPORT BUTTON */}
        <div className="coursera-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#7A1F2B] font-heading">Acquiring Transaction Records</h3>

            <button
              onClick={exportToCSV}
              className="bg-[#FAF2E8] hover:bg-[#F5E8D8] text-[#7A1F2B] text-xs font-bold px-4 py-2 rounded-full border border-[#7A1F2B]/20 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export to Excel
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-7 h-7 text-[#7A1F2B] animate-spin" />
            </div>
          ) : data.items.length === 0 ? (
            <div className="text-center py-16 space-y-2 bg-[#FAF2E8] rounded-2xl border border-[#7A1F2B]/10">
              <AlertCircle className="w-10 h-10 text-[#9E8984] mx-auto" />
              <h4 className="text-base font-bold text-[#7A1F2B]">No Transactions Available</h4>
              <p className="text-xs text-[#6b5a56]">No transaction logs match the selected filter criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#7A1F2B]/15 text-xs font-bold text-[#7A1F2B] uppercase tracking-wider bg-[#FBF3E7]/50">
                    <th className="py-3.5 px-4 rounded-l-xl">Txn ID</th>
                    <th className="py-3.5 px-4">Merchant ID</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Customer Email</th>
                    <th className="py-3.5 px-4">Txn Amt</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Created On</th>
                    <th className="py-3.5 px-4">Customer Name</th>
                    <th className="py-3.5 px-4 rounded-r-xl">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#7A1F2B]/10">
                  {data.items.map((txn) => (
                    <tr key={txn.id} className="hover:bg-[#FBF3E7]/60 transition-colors">
                      <td className="py-4 px-4 font-bold text-[#7A1F2B]">{txn.id}</td>
                      <td className="py-4 px-4 text-xs font-medium text-[#6b5a56]">{txn.merchantId}</td>
                      <td className="py-4 px-4">
                        <span className={getStatusBadge(txn.status)}>{txn.status}</span>
                      </td>
                      <td className="py-4 px-4 text-xs text-[#241417]">{txn.customerEmail}</td>
                      <td className="py-4 px-4 font-extrabold text-[#241417]">
                        ₹{txn.txnAmt.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-4 text-xs font-semibold text-[#926A18]">{txn.transactionType}</td>
                      <td className="py-4 px-4 text-xs text-[#6b5a56]">{txn.createdOn}</td>
                      <td className="py-4 px-4 font-semibold text-[#241417]">{txn.customerName}</td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => setSelectedTxnDetail(txn)}
                          className="p-1.5 rounded-lg bg-[#7A1F2B]/10 text-[#7A1F2B] hover:bg-[#7A1F2B] hover:text-white transition-colors cursor-pointer"
                          title="View Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* TRANSACTION DETAIL MODAL */}
      {selectedTxnDetail && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="coursera-card bg-[#FDF6EE] w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#7A1F2B]/15">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#7A1F2B]" />
                <h3 className="text-lg font-bold text-[#7A1F2B] font-heading">Transaction Detail</h3>
              </div>
              <button
                onClick={() => setSelectedTxnDetail(null)}
                className="w-7 h-7 rounded-full bg-[#FAF2E8] text-[#7A1F2B] flex items-center justify-center hover:bg-[#F5E8D8]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1.5 border-b border-[#7A1F2B]/10">
                <span className="text-[#6b5a56]">Transaction ID:</span>
                <span className="font-bold text-[#7A1F2B]">{selectedTxnDetail.id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#7A1F2B]/10">
                <span className="text-[#6b5a56]">Merchant Name:</span>
                <span className="font-semibold text-[#241417]">{selectedTxnDetail.merchantName} ({selectedTxnDetail.merchantId})</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#7A1F2B]/10">
                <span className="text-[#6b5a56]">Transaction Amount:</span>
                <span className="font-extrabold text-[#7A1F2B] text-base">₹{selectedTxnDetail.txnAmt.toLocaleString('en-IN')} {selectedTxnDetail.currency}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#7A1F2B]/10">
                <span className="text-[#6b5a56]">Status:</span>
                <span className={getStatusBadge(selectedTxnDetail.status)}>{selectedTxnDetail.status}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#7A1F2B]/10">
                <span className="text-[#6b5a56]">Customer Info:</span>
                <span className="font-medium text-[#241417]">{selectedTxnDetail.customerName} ({selectedTxnDetail.customerEmail})</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#7A1F2B]/10">
                <span className="text-[#6b5a56]">Payment Method:</span>
                <span className="font-semibold text-[#C99A3D]">{selectedTxnDetail.transactionType} ({selectedTxnDetail.detail})</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#6b5a56]">Created On:</span>
                <span className="text-xs font-mono text-[#241417]">{selectedTxnDetail.createdOn}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#7A1F2B]/15 text-right">
              <button
                onClick={() => setSelectedTxnDetail(null)}
                className="px-5 py-2 rounded-full bg-[#7A1F2B] text-white text-xs font-bold hover:bg-[#58141E]"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </PayVangLayout>
  );
}
