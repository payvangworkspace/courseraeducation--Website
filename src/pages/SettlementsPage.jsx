import React, { useEffect, useState } from 'react';
import PayVangLayout from '../components/layout/PayVangLayout';
import StatCard from '../components/common/StatCard';
import GradientButton from '../components/common/GradientButton';
import { CheckCircle2, Filter, RefreshCw, Layers, ArrowRightLeft } from 'lucide-react';
import { merchantApi, unwrapList } from '../api';

export default function SettlementsPage() {
  const [data, setData] = useState({ summary: null, items: [] });
  const [loading, setLoading] = useState(true);
  const [merchantsList, setMerchantsList] = useState([]);

  const [merchant, setMerchant] = useState('ALL');
  const [currency, setCurrency] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    merchantApi
      .getAllMerchantList({ start: 0, size: "25", keyword: "" })
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

  const fetchSettlements = () => {
    setLoading(true);
    const query = new URLSearchParams({ merchant, currency, status }).toString();
    fetch(`/api/settlements?${query}`)
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
    fetchSettlements();
  }, [merchant, status]);

  const handleCheckSettlement = () => {
    alert('Initiating Settlement Reconciliation Check across banking gateways...');
    fetchSettlements();
  };

  return (
    <PayVangLayout title="Payin - Settlements" subtitle="Merchant payout settlements, MDR commission deductions & net clearing.">
      <div className="space-y-6">
        {/* FILTER BAR WITH CHECK SETTLEMENT BUTTON */}
        <div className="coursera-card p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs w-full md:w-auto flex-1">
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

            <div>
              <label className="block text-[#6b5a56] font-semibold mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-[#FAF2E8] border border-[#7A1F2B]/15 text-[#241417] rounded-xl px-3 py-2 outline-none font-medium"
              >
                <option value="ALL">INR (₹)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-[#6b5a56] font-semibold mb-1">Date From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full bg-[#FAF2E8] border border-[#7A1F2B]/15 text-[#241417] rounded-xl px-3 py-2 outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-[#6b5a56] font-semibold mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-[#FAF2E8] border border-[#7A1F2B]/15 text-[#241417] rounded-xl px-3 py-2 outline-none font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="Settled">Settled</option>
                <option value="Processing">Processing</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <GradientButton onClick={handleCheckSettlement}>
            Check Settlement
          </GradientButton>
        </div>

        {/* SUMMARY CARD */}
        {data.summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <StatCard
              title="Total Settlement Batches"
              value={data.summary.count}
              badgeText="Reconciled"
              badgeType="maroon"
            />
            <StatCard
              title="Gross Amount Payable"
              value={`₹${(data.summary.totalAmountPayable / 100000).toFixed(2)} Lakhs`}
              badgeText="Before MDR"
              badgeType="gold"
            />
            <StatCard
              title="Net Settlement Transferred"
              value={`₹${(data.summary.totalNetSettlement / 100000).toFixed(2)} Lakhs`}
              badgeText="Cleared Escrow"
              badgeType="green"
            />
          </div>
        )}

        {/* SETTLEMENTS TABLE */}
        <div className="coursera-card p-6 space-y-4">
          <h3 className="text-lg font-bold text-[#7A1F2B] font-heading">Settlement Ledger Records</h3>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-7 h-7 text-[#7A1F2B] animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#7A1F2B]/15 text-xs font-bold text-[#7A1F2B] uppercase tracking-wider bg-[#FBF3E7]/50">
                    <th className="py-3.5 px-4 rounded-l-xl">Merchant ID</th>
                    <th className="py-3.5 px-4">Amount Payable</th>
                    <th className="py-3.5 px-4">Merchant Charge (MDR)</th>
                    <th className="py-3.5 px-4">Net Settlement</th>
                    <th className="py-3.5 px-4">Created Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">UTR Number</th>
                    <th className="py-3.5 px-4 rounded-r-xl">Payment Mode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#7A1F2B]/10">
                  {data.items.map((s) => (
                    <tr key={s.id} className="hover:bg-[#FBF3E7]/60 transition-colors">
                      <td className="py-4 px-4 font-bold text-[#7A1F2B]">{s.merchantId}</td>
                      <td className="py-4 px-4 font-semibold text-[#241417]">₹{s.amountPayable.toLocaleString('en-IN')}</td>
                      <td className="py-4 px-4 text-xs font-semibold text-[#9E8984]">₹{s.merchantCharge.toLocaleString('en-IN')}</td>
                      <td className="py-4 px-4 font-extrabold text-[#16a34a]">₹{s.netSettlement.toLocaleString('en-IN')}</td>
                      <td className="py-4 px-4 text-xs text-[#6b5a56]">{s.createdDate}</td>
                      <td className="py-4 px-4">
                        <span className={`coursera-badge-${s.status === 'Settled' ? 'green' : s.status === 'Processing' ? 'gold' : 'red'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs font-mono text-[#7A1F2B]">{s.utrNumber}</td>
                      <td className="py-4 px-4 text-xs font-bold text-[#6b5a56]">{s.paymentMode}</td>
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
