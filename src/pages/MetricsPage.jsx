import React, { useEffect, useState } from 'react';
import PayVangLayout from '../components/layout/PayVangLayout';
import StatCard from '../components/common/StatCard';
import { Activity, RefreshCw } from 'lucide-react';

export default function MetricsPage() {
  const [totalHits, setTotalHits] = useState(null);
  const [urlHits, setUrlHits] = useState([]);
  const [statusHits, setStatusHits] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/v1/metrics/hits/total').then((r) => r.json()),
      fetch('/api/v1/metrics/hits/url').then((r) => r.json()),
      fetch('/api/v1/metrics/hits/status').then((r) => r.json())
    ])
      .then(([t, u, s]) => {
        setTotalHits(t);
        setUrlHits(u);
        setStatusHits(s);
        setLoading(false);
      });
  }, []);

  return (
    <PayVangLayout title="System Metrics & Traffic" subtitle="Real-time API gateway URL hits, HTTP status breakdown & uptime telemetry.">
      <div className="space-y-6">
        {totalHits && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <StatCard
              title="Total API Gateway Hits"
              value={totalHits.totalHits.toLocaleString()}
              badgeText="Telemetry Live"
              badgeType="maroon"
            />
            <StatCard
              title="Platform Uptime"
              value={totalHits.uptimePercentage}
              badgeText="High Availability"
              badgeType="green"
            />
          </div>
        )}

        <div className="coursera-card p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#7A1F2B]" />
            <h3 className="text-xl font-bold text-[#7A1F2B] font-heading">API Hits Per Endpoint URL</h3>
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
                    <th className="py-3.5 px-4 rounded-l-xl">Endpoint URL</th>
                    <th className="py-3.5 px-4 rounded-r-xl">Total Request Hits</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#7A1F2B]/10">
                  {urlHits.map((h, i) => (
                    <tr key={i} className="hover:bg-[#FBF3E7]/60">
                      <td className="py-4 px-4 font-mono font-bold text-[#7A1F2B]">{h.url}</td>
                      <td className="py-4 px-4 font-extrabold text-[#241417]">{h.hits.toLocaleString()} hits</td>
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
