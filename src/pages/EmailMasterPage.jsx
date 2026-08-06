import React, { useEffect, useState } from 'react';
import PayVangLayout from '../components/layout/PayVangLayout';
import { Mail, Plus, RefreshCw } from 'lucide-react';

export default function EmailMasterPage() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/GetEmailMasterList', { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        setEmails(data);
        setLoading(false);
      });
  }, []);

  return (
    <PayVangLayout title="Email Master Templates" subtitle="System transactional email triggers, SMTP credentials & body templates.">
      <div className="coursera-card p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#7A1F2B]" />
            <h3 className="text-xl font-bold text-[#7A1F2B] font-heading">SMTP Email Templates</h3>
          </div>
          <button
            onClick={() => alert('Creating email template...')}
            className="bg-[#241417] hover:bg-[#7A1F2B] text-white text-sm font-semibold px-5 py-2.5 rounded-full inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Email Template</span>
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
                  <th className="py-3.5 px-4 rounded-l-xl">Email Code</th>
                  <th className="py-3.5 px-4">From Email</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">SMTP Host</th>
                  <th className="py-3.5 px-4 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#7A1F2B]/10">
                {emails.map((em) => (
                  <tr key={em.id} className="hover:bg-[#FBF3E7]/60">
                    <td className="py-4 px-4 font-bold text-[#7A1F2B]">{em.emailCode}</td>
                    <td className="py-4 px-4 font-medium text-[#241417]">{em.fromEmail}</td>
                    <td className="py-4 px-4 font-semibold text-[#C99A3D]">{em.subject}</td>
                    <td className="py-4 px-4 text-xs font-mono text-[#6b5a56]">{em.smtpHost}:{em.smtpPort}</td>
                    <td className="py-4 px-4">
                      <span className="coursera-badge-green">{em.status}</span>
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
