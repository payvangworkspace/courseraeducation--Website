import React, { useEffect, useState } from 'react';
import PayVangLayout from '../components/layout/PayVangLayout';
import GradientButton from '../components/common/GradientButton';
import { Send, Plus, RefreshCw, X, CheckCircle2 } from 'lucide-react';

export default function RemittancePage() {
  const [remittances, setRemittances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [selectedMerchant, setSelectedMerchant] = useState('ALL');
  const [selectedCurrency, setSelectedCurrency] = useState('INR');

  const [formData, setFormData] = useState({
    utr: '',
    payableAmount: '',
    remittanceDate: new Date().toISOString().split('T')[0],
    merchant: 'Reliance Retail Ltd',
    currencyCode: 'INR',
    acquirerCode: 'HDFC_PG_DIRECT'
  });

  const fetchRemittances = () => {
    setLoading(true);
    fetch('/api/remittances')
      .then((res) => res.json())
      .then((data) => {
        setRemittances(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchRemittances();
  }, []);

  const handleAddRemittance = (e) => {
    e.preventDefault();
    if (!formData.utr || !formData.payableAmount) {
      alert('Please fill in UTR and Payable Amount.');
      return;
    }

    fetch('/api/remittances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then((newRem) => {
        setShowModal(false);
        setFormData({
          utr: '',
          payableAmount: '',
          remittanceDate: new Date().toISOString().split('T')[0],
          merchant: 'Reliance Retail Ltd',
          currencyCode: 'INR',
          acquirerCode: 'HDFC_PG_DIRECT'
        });
        fetchRemittances();
      });
  };

  const filteredRemittances = remittances.filter((r) => {
    if (selectedMerchant !== 'ALL' && r.merchant !== selectedMerchant) return false;
    return true;
  });

  return (
    <PayVangLayout title="Payin - Remittance" subtitle="Bank remittance transfer logs, UTR records & acquirer settlement sync.">
      <div className="coursera-card p-6 md:p-8 space-y-6">
        {/* SELECTORS & ADD BUTTON */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[#7A1F2B]/10">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div>
              <label className="block text-[11px] font-bold text-[#7A1F2B] uppercase mb-1">Select Merchant</label>
              <select
                value={selectedMerchant}
                onChange={(e) => setSelectedMerchant(e.target.value)}
                className="bg-[#FAF2E8] border border-[#7A1F2B]/15 text-sm rounded-xl px-3.5 py-2 text-[#241417] font-medium"
              >
                <option value="ALL">All Merchants</option>
                <option value="Reliance Retail Ltd">Reliance Retail Ltd</option>
                <option value="Flipkart Logistics">Flipkart Logistics</option>
                <option value="Nykaa E-Retail">Nykaa E-Retail</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#7A1F2B] uppercase mb-1">Currency</label>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="bg-[#FAF2E8] border border-[#7A1F2B]/15 text-sm rounded-xl px-3.5 py-2 text-[#241417] font-medium"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-[#241417] hover:bg-[#7A1F2B] text-white text-sm font-semibold px-5 py-2.5 rounded-full inline-flex items-center gap-2 shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Remittance</span>
          </button>
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-7 h-7 text-[#7A1F2B] animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#7A1F2B]/15 text-xs font-bold text-[#7A1F2B] uppercase tracking-wider bg-[#FBF3E7]/50">
                  <th className="py-3.5 px-4 rounded-l-xl">UTR Number</th>
                  <th className="py-3.5 px-4">Payable Amount</th>
                  <th className="py-3.5 px-4">Remittance Date</th>
                  <th className="py-3.5 px-4">Merchant Name</th>
                  <th className="py-3.5 px-4">Currency Code</th>
                  <th className="py-3.5 px-4">Acquirer Code</th>
                  <th className="py-3.5 px-4 rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#7A1F2B]/10">
                {filteredRemittances.map((rem) => (
                  <tr key={rem.id} className="hover:bg-[#FBF3E7]/60 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-[#7A1F2B]">{rem.utr}</td>
                    <td className="py-4 px-4 font-extrabold text-[#241417]">₹{rem.payableAmount.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-4 text-xs text-[#6b5a56]">{rem.remittanceDate}</td>
                    <td className="py-4 px-4 font-semibold text-[#241417]">{rem.merchant}</td>
                    <td className="py-4 px-4">
                      <span className="coursera-badge-gold text-xs">{rem.currencyCode}</span>
                    </td>
                    <td className="py-4 px-4 text-xs font-semibold text-[#7A1F2B]">{rem.acquirerCode}</td>
                    <td className="py-4 px-4 text-xs">
                      <button
                        onClick={() => alert(`Verified UTR ${rem.utr}`)}
                        className="text-[#16a34a] font-bold hover:underline cursor-pointer"
                      >
                        Verified
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD REMITTANCE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="coursera-card bg-[#FDF6EE] w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#7A1F2B]/15">
              <h3 className="text-lg font-bold text-[#7A1F2B] font-heading">Add Bank Remittance</h3>
              <button onClick={() => setShowModal(false)} className="w-7 h-7 rounded-full bg-[#FAF2E8] text-[#7A1F2B] flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRemittance} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#7A1F2B] uppercase mb-1">UTR Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UTR2026080699120"
                  value={formData.utr}
                  onChange={(e) => setFormData({ ...formData, utr: e.target.value })}
                  className="w-full bg-white border border-[#7A1F2B]/15 text-sm rounded-xl px-3.5 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#7A1F2B] uppercase mb-1">Payable Amount (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1500000"
                  value={formData.payableAmount}
                  onChange={(e) => setFormData({ ...formData, payableAmount: e.target.value })}
                  className="w-full bg-white border border-[#7A1F2B]/15 text-sm rounded-xl px-3.5 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#7A1F2B] uppercase mb-1">Remittance Date</label>
                <input
                  type="date"
                  value={formData.remittanceDate}
                  onChange={(e) => setFormData({ ...formData, remittanceDate: e.target.value })}
                  className="w-full bg-white border border-[#7A1F2B]/15 text-sm rounded-xl px-3.5 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#7A1F2B] uppercase mb-1">Merchant</label>
                <select
                  value={formData.merchant}
                  onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
                  className="w-full bg-white border border-[#7A1F2B]/15 text-sm rounded-xl px-3.5 py-2"
                >
                  <option value="Reliance Retail Ltd">Reliance Retail Ltd</option>
                  <option value="Flipkart Logistics">Flipkart Logistics</option>
                  <option value="Nykaa E-Retail">Nykaa E-Retail</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#7A1F2B]/15">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-full border border-[#7A1F2B]/20 text-[#7A1F2B] text-xs font-bold"
                >
                  Cancel
                </button>
                <GradientButton type="submit">Submit Remittance</GradientButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </PayVangLayout>
  );
}
