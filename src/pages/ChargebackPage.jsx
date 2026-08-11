import React, { useEffect, useState } from 'react';
import PayVangLayout from '../components/layout/PayVangLayout';
import StatCard from '../components/common/StatCard';
import { AlertOctagon, Download, Filter, RefreshCw } from 'lucide-react';
import { merchantApi, unwrapList } from '../api';

export default function ChargebackPage() {
  const [data, setData] = useState({ stats: null, items: [] });
  const [loading, setLoading] = useState(true);
  const [merchantsList, setMerchantsList] = useState([]);

  const [merchant, setMerchant] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [currency, setCurrency] = useState('INR');

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

  const fetchChargebacks = () => {
    setLoading(true);
    const query = new URLSearchParams({ merchant, status }).toString();
    fetch(`/api/chargebacks?${query}`)
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchChargebacks();
  }, [merchant, status]);

  const exportCSV = () => {
    if (!data.items || data.items.length === 0) return;
    const headers = ['Chargeback ID', 'Transaction ID', 'Chargeback Amount', 'Chargeback Date', 'Merchant Name', 'Payment Method', 'Status'];
    const csvRows = [headers.join(',')];
    data.items.forEach((item) => {
      csvRows.push([
        item.chargebackId,
        item.transactionId,
        item.chargebackAmount,
        item.chargebackDate,
        `"${item.merchantName}"`,
        item.paymentMethod,
        item.chargebackStatus
      ].join(','));
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PayVang_Chargebacks_Export.csv`;
    a.click();
  };

  const getStatusPill = (st) => {
    switch (st) {
      case 'Done':
        return 'coursera-badge-green';
      case 'Pending':
        return 'coursera-badge-gold';
      case 'Failed':
      default:
        return 'coursera-badge-red';
    }
  };

  return (
    <PayVangLayout title="Payin - Chargeback" subtitle="Merchant dispute management, card network representments & fraud risk mitigation.">
      <div className="space-y-6">
        {/* 4 STAT CARDS */}
        {data.stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Chargebacks"
              value={data.stats.totalCount}
              badgeText="Disputed"
              badgeType="maroon"
            />
            <StatCard
              title="Total Dispute Amount"
              value={`₹${data.stats.totalAmount.toLocaleString('en-IN')}`}
              badgeText="Gross Value"
              badgeType="gold"
            />
            <StatCard
              title="Pending Disputes"
              value={data.stats.pendingCount}
              badgeText="Under Evidence Review"
              badgeType="gold"
            />
            <StatCard
              title="Failed Representments"
              value={data.stats.failedCount}
              badgeText="Loss Ratio 0.4%"
              badgeType="red"
            />
          </div>
        )}

        {/* FILTER BAR */}
        <div className="coursera-card p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#7A1F2B]">
            <Filter className="w-4 h-4 text-[#C99A3D]" />
            Chargeback Disputes Filter
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-[#6b5a56] font-semibold mb-1">Merchant</label>
              <select
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                className="w-full bg-[#FAF2E8] border border-[#7A1F2B]/15 text-[#241417] rounded-xl px-3 py-2 outline-none font-medium"
              >
                <option value="ALL">All Merchants</option>
                {merchantsList.map((m) => (
                  <option key={m.id} value={m.name}>{m.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#6b5a56] font-semibold mb-1">Payment Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-[#FAF2E8] border border-[#7A1F2B]/15 text-[#241417] rounded-xl px-3 py-2 outline-none font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="Done">Done</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="block text-[#6b5a56] font-semibold mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-[#FAF2E8] border border-[#7A1F2B]/15 text-[#241417] rounded-xl px-3 py-2 outline-none font-medium"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-[#6b5a56] font-semibold mb-1">Date Range</label>
              <input
                type="date"
                className="w-full bg-[#FAF2E8] border border-[#7A1F2B]/15 text-[#241417] rounded-xl px-3 py-2 outline-none font-medium"
              />
            </div>
          </div>
        </div>

        {/* CHARGEBACKS TABLE WITH EXPORT BUTTON */}
        <div className="coursera-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#7A1F2B] font-heading">Chargeback Dispute Registry</h3>

            <button
              onClick={exportCSV}
              className="bg-[#FAF2E8] hover:bg-[#F5E8D8] text-[#7A1F2B] text-xs font-bold px-4 py-2 rounded-full border border-[#7A1F2B]/20 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export Disputes
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-7 h-7 text-[#7A1F2B] animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#7A1F2B]/15 text-xs font-bold text-[#7A1F2B] uppercase tracking-wider bg-[#FBF3E7]/50">
                    <th className="py-3.5 px-4 rounded-l-xl">Chargeback ID</th>
                    <th className="py-3.5 px-4">Transaction ID</th>
                    <th className="py-3.5 px-4">Chargeback Amount</th>
                    <th className="py-3.5 px-4">Chargeback Date</th>
                    <th className="py-3.5 px-4">Merchant Name</th>
                    <th className="py-3.5 px-4">Payment Method</th>
                    <th className="py-3.5 px-4 rounded-r-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#7A1F2B]/10">
                  {data.items.map((cb) => (
                    <tr key={cb.id} className="hover:bg-[#FBF3E7]/60 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-[#7A1F2B]">{cb.chargebackId}</td>
                      <td className="py-4 px-4 text-xs font-mono text-[#6b5a56]">{cb.transactionId}</td>
                      <td className="py-4 px-4 font-extrabold text-[#241417]">₹{cb.chargebackAmount.toLocaleString('en-IN')}</td>
                      <td className="py-4 px-4 text-xs text-[#6b5a56]">{cb.chargebackDate}</td>
                      <td className="py-4 px-4 font-semibold text-[#241417]">{cb.merchantName}</td>
                      <td className="py-4 px-4 text-xs font-semibold text-[#926A18]">{cb.paymentMethod}</td>
                      <td className="py-4 px-4">
                        <span className={getStatusPill(cb.chargebackStatus)}>
                          {cb.chargebackStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PayVangLayout>
  );
}
