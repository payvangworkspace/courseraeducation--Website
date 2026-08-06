import React, { useEffect, useState } from 'react';
import PayVangLayout from '../components/layout/PayVangLayout';
import { ShieldCheck, Plus, RefreshCw, Trash2 } from 'lucide-react';

export default function IPWhitelistPage() {
  const [ipList, setIpList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/admin/keys/GetIpKeyList')
      .then((res) => res.json())
      .then((data) => {
        setIpList(data);
        setLoading(false);
      });
  }, []);

  return (
    <PayVangLayout title="IP Whitelist & Egress" subtitle="Allowed merchant API server IP addresses & payout egress whitelists.">
      <div className="coursera-card p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#7A1F2B]" />
            <h3 className="text-xl font-bold text-[#7A1F2B] font-heading">Whitelisted Ingress IP Addresses</h3>
          </div>
          <button
            onClick={() => alert('Whitelisting new IP address...')}
            className="bg-[#241417] hover:bg-[#7A1F2B] text-white text-sm font-semibold px-5 py-2.5 rounded-full inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Whitelist IP</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <RefreshCw className="w-7 h-7 text-[#7A1F2B] animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#7A1F2B]/15 text-xs font-bold text-[#7A1F2B] uppercase bg-[#FBF3E7]/50">
                  <th className="py-3.5 px-4 rounded-l-xl">ID</th>
                  <th className="py-3.5 px-4">Merchant ID</th>
                  <th className="py-3.5 px-4">IP Address</th>
                  <th className="py-3.5 px-4">System Name</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4 rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#7A1F2B]/10">
                {ipList.map((ip) => (
                  <tr key={ip.id} className="hover:bg-[#FBF3E7]/60">
                    <td className="py-4 px-4 font-bold text-[#7A1F2B]">{ip.id}</td>
                    <td className="py-4 px-4 font-semibold text-[#241417]">{ip.merchantId}</td>
                    <td className="py-4 px-4 font-mono font-bold text-[#16a34a]">{ip.ipAddress}</td>
                    <td className="py-4 px-4 font-semibold text-[#6b5a56]">{ip.systemName}</td>
                    <td className="py-4 px-4 text-xs text-[#9E8984]">{ip.ipAddressDesc}</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => alert(`Revoking IP ${ip.ipAddress}`)}
                        className="p-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                        title="Remove IP"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
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
