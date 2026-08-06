import React, { useEffect, useState } from 'react';
import PayVangLayout from '../components/layout/PayVangLayout';
import { Sliders, RefreshCw } from 'lucide-react';

export default function ConfigurationsPage() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/configurations')
      .then((res) => res.json())
      .then((data) => {
        setConfigs(data);
        setLoading(false);
      });
  }, []);

  return (
    <PayVangLayout title="User Management - Configurations" subtitle="System environment variables, gateway toggles & operational limits.">
      <div className="coursera-card p-6 md:p-8 space-y-6">
        <h3 className="text-xl font-bold text-[#7A1F2B] font-heading">System Parameters</h3>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-7 h-7 text-[#7A1F2B] animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {configs.map((c) => (
              <div key={c.id} className="p-4 bg-[#FAF2E8] rounded-xl border border-[#7A1F2B]/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#7A1F2B]">{c.key}</span>
                    <span className="coursera-badge-gold text-[10px]">{c.group}</span>
                  </div>
                  <p className="text-xs text-[#6b5a56] mt-0.5">{c.description}</p>
                </div>
                <div className="font-mono text-xs font-bold text-[#241417] bg-white px-3 py-1.5 rounded-lg border border-[#7A1F2B]/15 self-start md:self-auto">
                  {c.value}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PayVangLayout>
  );
}
