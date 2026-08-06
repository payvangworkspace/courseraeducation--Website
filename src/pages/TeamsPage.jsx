import React, { useEffect, useState } from 'react';
import PayVangLayout from '../components/layout/PayVangLayout';
import { UserCheck, Plus, RefreshCw } from 'lucide-react';

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/teams')
      .then((res) => res.json())
      .then((data) => {
        setTeams(data);
        setLoading(false);
      });
  }, []);

  return (
    <PayVangLayout title="Teams" subtitle="Internal operations team, RBAC permission roles & access logs.">
      <div className="coursera-card p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#7A1F2B] font-heading">Internal Team Members</h3>
          <button
            onClick={() => alert('Inviting new team member...')}
            className="bg-[#241417] hover:bg-[#7A1F2B] text-white text-sm font-semibold px-5 py-2.5 rounded-full inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Invite Team Member</span>
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
                  <th className="py-3.5 px-4 rounded-l-xl">Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 rounded-r-xl">Last Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#7A1F2B]/10">
                {teams.map((t) => (
                  <tr key={t.id} className="hover:bg-[#FBF3E7]/60 transition-colors">
                    <td className="py-4 px-4 font-bold text-[#241417]">{t.name}</td>
                    <td className="py-4 px-4 text-xs font-medium text-[#6b5a56]">{t.email}</td>
                    <td className="py-4 px-4 font-semibold text-[#7A1F2B]">{t.role}</td>
                    <td className="py-4 px-4">
                      <span className="coursera-badge-green">{t.status}</span>
                    </td>
                    <td className="py-4 px-4 text-xs text-[#6b5a56]">{t.lastLogin}</td>
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
