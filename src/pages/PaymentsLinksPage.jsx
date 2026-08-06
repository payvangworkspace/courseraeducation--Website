import React, { useEffect, useState } from 'react';
import PayVangLayout from '../components/layout/PayVangLayout';
import GradientButton from '../components/common/GradientButton';
import { Link as LinkIcon, Plus, Copy, Check, ExternalLink, QrCode } from 'lucide-react';

export default function PaymentsLinksPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('Reliance Retail Ltd');

  const fetchLinks = () => {
    setLoading(true);
    fetch('/api/payment-links')
      .then((res) => res.json())
      .then((data) => {
        setLinks(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    fetch('/api/payment-links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, amount, merchant })
    })
      .then((res) => res.json())
      .then(() => {
        setShowModal(false);
        setTitle('');
        setAmount('');
        fetchLinks();
      });
  };

  const copyToClipboard = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <PayVangLayout title="Payments Links" subtitle="Generate instant no-code payment links, QR checkouts & shareable links.">
      <div className="coursera-card p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-[#7A1F2B] font-heading">Active Payment Links</h3>
            <p className="text-xs text-[#6b5a56]">Custom customer payment URLs & QR codes</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-[#241417] hover:bg-[#7A1F2B] text-white text-sm font-semibold px-5 py-2.5 rounded-full inline-flex items-center gap-2 shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Payment Link</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#7A1F2B]/15 text-xs font-bold text-[#7A1F2B] uppercase tracking-wider bg-[#FBF3E7]/50">
                <th className="py-3.5 px-4 rounded-l-xl">Link Title</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Merchant</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Created On</th>
                <th className="py-3.5 px-4 rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#7A1F2B]/10">
              {links.map((link) => (
                <tr key={link.id} className="hover:bg-[#FBF3E7]/60 transition-colors">
                  <td className="py-4 px-4 font-bold text-[#7A1F2B]">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-[#C99A3D]" />
                      <span>{link.title}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-extrabold text-[#241417]">₹{parseFloat(link.amount).toLocaleString('en-IN')}</td>
                  <td className="py-4 px-4 font-semibold text-[#6b5a56]">{link.merchant}</td>
                  <td className="py-4 px-4">
                    <span className="coursera-badge-green">{link.status}</span>
                  </td>
                  <td className="py-4 px-4 text-xs text-[#6b5a56]">{link.createdOn}</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => copyToClipboard(link.url, link.id)}
                      className="px-3 py-1.5 rounded-full bg-[#FAF2E8] border border-[#7A1F2B]/20 text-[#7A1F2B] text-xs font-bold hover:bg-[#F5E8D8] inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === link.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedId === link.id ? 'Copied' : 'Copy Link'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="coursera-card bg-[#FDF6EE] w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-[#7A1F2B] font-heading">Create Payment Link</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#7A1F2B] uppercase mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Festival Advance Payment"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border border-[#7A1F2B]/15 text-sm rounded-xl px-3.5 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#7A1F2B] uppercase mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-white border border-[#7A1F2B]/15 text-sm rounded-xl px-3.5 py-2"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#7A1F2B]/15">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-bold text-[#7A1F2B]">
                  Cancel
                </button>
                <GradientButton type="submit">Generate Link</GradientButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </PayVangLayout>
  );
}
