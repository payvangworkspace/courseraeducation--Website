import React, { useEffect, useState } from 'react';
import PayVangLayout from '../components/layout/PayVangLayout';
import GradientButton from '../components/common/GradientButton';
import { ArrowUpRight, Plus, RefreshCw, CheckCircle2, Clock } from 'lucide-react';

export default function PayoutPage() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/payouts')
      .then((res) => res.json())
      .then((data) => {
        setPayouts(data);
        setLoading(false);
      });
  }, []);

  return (
    <PayVangLayout title="Payout" subtitle="Instant vendor payouts, IMPS/RTGS disbursements & beneficiary management.">
      <div className="coursera-card p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-[#7A1F2B] font-heading">Payout Disbursements</h3>
            <p className="text-xs text-[#6b5a56]">Outbound batch payouts & bank clearing queue</p>
          </div>

          <GradientButton onClick={() => alert('Initiating payout batch request...')}>
            Trigger Instant Payout
          </GradientButton>
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
                  <th className="py-3.5 px-4 rounded-l-xl">Payout ID</th>
                  <th className="py-3.5 px-4">Beneficiary</th>
                  <th className="py-3.5 px-4">Bank Account</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 rounded-r-xl">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#7A1F2B]/10">
                {payouts.map((po) => (
                  <tr key={po.id} className="hover:bg-[#FBF3E7]/60 transition-colors">
                    <td className="py-4 px-4 font-bold text-[#7A1F2B]">{po.id}</td>
                    <td className="py-4 px-4 font-semibold text-[#241417]">{po.beneficiary}</td>
                    <td className="py-4 px-4 text-xs font-mono text-[#6b5a56]">{po.bankAccount}</td>
                    <td className="py-4 px-4 font-extrabold text-[#7A1F2B]">₹{po.amount.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-4">
                      <span className={`coursera-badge-${po.status === 'Success' ? 'green' : 'gold'}`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-[#6b5a56]">{po.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PayVangLayout>
  );
}
