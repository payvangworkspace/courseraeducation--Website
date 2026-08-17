import React, { useEffect, useMemo, useState } from 'react';
import PayVangLayout from '../components/layout/PayVangLayout';
import GradientButton from '../components/common/GradientButton';
import { Building2, Plus, Search, RefreshCw, X, FileJson } from 'lucide-react';
import { acquirerApi, unwrapList } from '../api';

function normalizeAcquirer(a) {
  const aggregatorCode = a.aggregatorCode || a.code || '—';
  const apiName = a.apiName || a.name || '—';
  const httpMethod = a.httpMethod || a.method || 'POST';
  const type = a.type || a.txnType || '—';
  const environment = a.environment || a.env || 'PRODUCTION';
  const status = a.status || (a.active === false ? 'Inactive' : 'Active');

  return {
    ...a,
    id: a.id || a.acquirerId || aggregatorCode || Math.random().toString(36).slice(2),
    aggregatorCode,
    apiName,
    httpMethod,
    type,
    environment,
    status,
    searchText: [aggregatorCode, apiName, httpMethod, type, environment, status]
      .join(' ')
      .toLowerCase(),
  };
}

function matchesKeyword(acquirer, keyword) {
  const query = String(keyword || '').trim().toLowerCase();
  if (!query) return true;
  return acquirer.searchText.includes(query);
}

export default function AcquirersPage() {
  const [acquirers, setAcquirers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');

  const [formData, setFormData] = useState({
    aggregatorCode: '',
    apiName: '',
    httpMethod: 'POST',
    type: 'UPI',
    environment: 'PRODUCTION',
    baseUrl: '',
    endpoint: '/charge',
    active: true,
    responseUrl: '',
    merchantId: '',
    webhookUrl: '',
    secretKey: '',
    responseKey: '',
    clientId: '',
    headers: '{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer {{SECRET_KEY}}"\n}',
    requestTemplate: '{\n  "merchant_id": "{{MERCHANT_ID}}",\n  "amount": "{{TXN_AMOUNT}}",\n  "currency": "INR",\n  "callback_url": "{{RESPONSE_URL}}"\n}'
  });

  const fetchAcquirers = async (query = keyword) => {
    setLoading(true);
    try {
      const res = await acquirerApi.getAllAcquirer({
        start: 0,
        size: "25",
        keyword: query || "",
      });
      setAcquirers(unwrapList(res).map(normalizeAcquirer));
    } catch (err) {
      console.error('Error fetching acquirers:', err);
      setAcquirers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(searchInput.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchAcquirers(keyword);
  }, [keyword]);

  const filteredAcquirers = useMemo(
    () => acquirers.filter((acquirer) => matchesKeyword(acquirer, searchInput)),
    [acquirers, searchInput]
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.aggregatorCode || !formData.apiName) {
      alert('Please fill in Aggregator Code and API Name.');
      return;
    }

    setSubmitting(true);
    try {
      await acquirerApi.createAcquirer(formData);
      setShowModal(false);
      await fetchAcquirers();
    } catch (err) {
      console.error('Error adding acquirer:', err);
      alert(err.message || 'Failed to create acquirer.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PayVangLayout title="User Management - Acquirers" subtitle="Acquiring gateway integrations, bank switches & payload payload rules.">
      <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', border: '1px solid rgba(122, 31, 43, 0.12)', boxShadow: '0 4px 20px rgba(122, 31, 43, 0.04)', marginBottom: '28px' }}>
        {/* TOP BAR ACTION */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#7A1F2B', fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}>Acquirer Switches & Connectors</h3>
            <p style={{ fontSize: '13px', color: '#6b5a56', margin: '4px 0 0 0' }}>Direct bank integrations, aggregator routes & webhook listeners</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            style={{
              height: '42px',
              padding: '0 24px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #7A1F2B 0%, #C99A3D 100%)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '13px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(122, 31, 43, 0.2)'
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Add Acquirer</span>
          </button>
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '360px', marginBottom: '20px' }}>
          <Search style={{ width: '16px', height: '16px', color: '#9E8984', position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search code, API name or type..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#FAF2E8',
              border: '1px solid rgba(122, 31, 43, 0.15)',
              color: '#241417',
              fontSize: '13px',
              borderRadius: '9999px',
              paddingLeft: '42px',
              paddingRight: '16px',
              height: '42px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* ACQUIRERS TABLE */}
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 0' }}>
            <RefreshCw className="w-7 h-7 text-[#7A1F2B] animate-spin" />
          </div>
        ) : filteredAcquirers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', backgroundColor: '#FAF2E8', borderRadius: '16px', border: '1px solid rgba(122, 31, 43, 0.1)' }}>
            <Building2 className="w-10 h-10 text-[#9E8984] mx-auto" />
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#7A1F2B', margin: '12px 0 4px 0' }}>No Data Found</h4>
            <p style={{ fontSize: '12px', color: '#6b5a56', margin: 0 }}>
              {searchInput.trim()
                ? 'Try a different search term, or add a new acquirer.'
                : 'No acquirers available. Add a new acquirer to get started.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid rgba(122, 31, 43, 0.12)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF2E8', borderBottom: '1px solid rgba(122, 31, 43, 0.12)' }}>
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Aggregator Code</th>
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>API Name</th>
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>HTTP Method</th>
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</th>
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Environment</th>
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAcquirers.map((acq) => (
                  <tr key={acq.id} style={{ borderBottom: '1px solid rgba(122, 31, 43, 0.06)' }}>
                    <td style={{ padding: '16px 20px', fontWeight: 700, color: '#7A1F2B' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Building2 style={{ width: '16px', height: '16px', color: '#C99A3D' }} />
                        <span>{acq.aggregatorCode}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: 600, color: '#241417', fontSize: '13px' }}>{acq.apiName}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ backgroundColor: 'rgba(122, 31, 43, 0.1)', color: '#7A1F2B', fontSize: '12px', fontWeight: 800, padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(122, 31, 43, 0.2)' }}>
                        {acq.httpMethod}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: '#6b5a56' }}>{acq.type}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 800, padding: '4px 10px', borderRadius: '9999px', border: '1px solid transparent', backgroundColor: acq.environment === 'PRODUCTION' ? 'rgba(22,163,74,0.1)' : 'rgba(217,119,6,0.1)', color: acq.environment === 'PRODUCTION' ? '#16a34a' : '#d97706', borderColor: acq.environment === 'PRODUCTION' ? 'rgba(22,163,74,0.25)' : 'rgba(217,119,6,0.25)' }}>
                        {acq.environment}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 800, padding: '4px 10px', borderRadius: '9999px', border: '1px solid transparent', backgroundColor: acq.status === 'Active' ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)', color: acq.status === 'Active' ? '#16a34a' : '#dc2626', borderColor: acq.status === 'Active' ? 'rgba(22,163,74,0.25)' : 'rgba(220,38,38,0.25)' }}>
                        {acq.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#7A1F2B' }}>
                      <button
                        onClick={() => alert(`Inspecting configuration payload for ${acq.aggregatorCode}`)}
                        style={{ background: 'none', border: 'none', color: '#7A1F2B', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Configure
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD ACQUIRER MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="coursera-card bg-[#FDF6EE] w-full max-w-4xl p-6 md:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#7A1F2B]/15">
              <div>
                <h3 className="text-xl font-bold text-[#7A1F2B] font-heading">Add Acquirer Gateway API</h3>
                <p className="text-xs text-[#6b5a56]">Configure connector endpoints, secrets, headers & request template</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-[#FAF2E8] text-[#7A1F2B] flex items-center justify-center hover:bg-[#F5E8D8] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#7A1F2B] uppercase mb-1">Aggregator Code *</label>
                  <input
                    type="text"
                    name="aggregatorCode"
                    value={formData.aggregatorCode}
                    onChange={handleChange}
                    placeholder="e.g. HDFC_PG_DIRECT"
                    className="w-full bg-white border border-[#7A1F2B]/15 text-sm rounded-xl px-3.5 py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A1F2B] uppercase mb-1">API Name *</label>
                  <input
                    type="text"
                    name="apiName"
                    value={formData.apiName}
                    onChange={handleChange}
                    placeholder="e.g. HDFC SmartHub Direct"
                    className="w-full bg-white border border-[#7A1F2B]/15 text-sm rounded-xl px-3.5 py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A1F2B] uppercase mb-1">HTTP Method</label>
                  <select
                    name="httpMethod"
                    value={formData.httpMethod}
                    onChange={handleChange}
                    className="w-full bg-white border border-[#7A1F2B]/15 text-sm rounded-xl px-3.5 py-2"
                  >
                    <option value="POST">POST</option>
                    <option value="GET">GET</option>
                    <option value="PUT">PUT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A1F2B] uppercase mb-1">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full bg-white border border-[#7A1F2B]/15 text-sm rounded-xl px-3.5 py-2"
                  >
                    <option value="UPI">UPI</option>
                    <option value="NETBANKING">NETBANKING</option>
                    <option value="CARDS">CARDS</option>
                    <option value="WALLET">WALLET</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A1F2B] uppercase mb-1">Environment</label>
                  <select
                    name="environment"
                    value={formData.environment}
                    onChange={handleChange}
                    className="w-full bg-white border border-[#7A1F2B]/15 text-sm rounded-xl px-3.5 py-2"
                  >
                    <option value="PRODUCTION">PRODUCTION</option>
                    <option value="SANDBOX">SANDBOX</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-sm font-bold text-[#7A1F2B] cursor-pointer">
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={handleChange}
                      className="w-4 h-4 accent-[#7A1F2B]"
                    />
                    Active Gateway Switch
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#7A1F2B] uppercase mb-1">Base URL</label>
                  <input
                    type="text"
                    name="baseUrl"
                    value={formData.baseUrl}
                    onChange={handleChange}
                    placeholder="https://api.hdfcbank.com/v2"
                    className="w-full bg-white border border-[#7A1F2B]/15 text-sm rounded-xl px-3.5 py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A1F2B] uppercase mb-1">Endpoint</label>
                  <input
                    type="text"
                    name="endpoint"
                    value={formData.endpoint}
                    onChange={handleChange}
                    placeholder="/charge"
                    className="w-full bg-white border border-[#7A1F2B]/15 text-sm rounded-xl px-3.5 py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A1F2B] uppercase mb-1">Response URL</label>
                  <input
                    type="text"
                    name="responseUrl"
                    value={formData.responseUrl}
                    onChange={handleChange}
                    placeholder="https://payvang.com/callback/hdfc"
                    className="w-full bg-white border border-[#7A1F2B]/15 text-sm rounded-xl px-3.5 py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A1F2B] uppercase mb-1">Merchant ID</label>
                  <input
                    type="text"
                    name="merchantId"
                    value={formData.merchantId}
                    onChange={handleChange}
                    placeholder="HDFC_MCH_88291"
                    className="w-full bg-white border border-[#7A1F2B]/15 text-sm rounded-xl px-3.5 py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A1F2B] uppercase mb-1">Webhook URL</label>
                  <input
                    type="text"
                    name="webhookUrl"
                    value={formData.webhookUrl}
                    onChange={handleChange}
                    placeholder="https://payvang.com/wh/hdfc"
                    className="w-full bg-white border border-[#7A1F2B]/15 text-sm rounded-xl px-3.5 py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A1F2B] uppercase mb-1">Client ID</label>
                  <input
                    type="text"
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleChange}
                    placeholder="cli_hdfc_881"
                    className="w-full bg-white border border-[#7A1F2B]/15 text-sm rounded-xl px-3.5 py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A1F2B] uppercase mb-1">Secret Key</label>
                  <input
                    type="password"
                    name="secretKey"
                    value={formData.secretKey}
                    onChange={handleChange}
                    placeholder="sec_hdfc_live_9981273"
                    className="w-full bg-white border border-[#7A1F2B]/15 text-sm rounded-xl px-3.5 py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A1F2B] uppercase mb-1">Response Key</label>
                  <input
                    type="password"
                    name="responseKey"
                    value={formData.responseKey}
                    onChange={handleChange}
                    placeholder="resp_key_hd_33"
                    className="w-full bg-white border border-[#7A1F2B]/15 text-sm rounded-xl px-3.5 py-2"
                  />
                </div>
              </div>

              {/* HEADERS & REQUEST TEMPLATE JSON TEXTAREAS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-[#7A1F2B] uppercase mb-1">
                    <FileJson className="w-3.5 h-3.5 text-[#C99A3D]" />
                    HTTP Headers (JSON)
                  </label>
                  <textarea
                    name="headers"
                    rows={5}
                    value={formData.headers}
                    onChange={handleChange}
                    className="w-full bg-[#241417] text-[#C99A3D] font-mono text-xs rounded-xl p-3 border border-[#7A1F2B]/30 outline-none focus:border-[#C99A3D]"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-[#7A1F2B] uppercase mb-1">
                    <FileJson className="w-3.5 h-3.5 text-[#C99A3D]" />
                    Request Payload Template (JSON)
                  </label>
                  <textarea
                    name="requestTemplate"
                    rows={5}
                    value={formData.requestTemplate}
                    onChange={handleChange}
                    className="w-full bg-[#241417] text-[#16a34a] font-mono text-xs rounded-xl p-3 border border-[#7A1F2B]/30 outline-none focus:border-[#16a34a]"
                  />
                </div>
              </div>

              {/* MODAL ACTIONS */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#7A1F2B]/15">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 rounded-full border border-[#7A1F2B]/20 text-[#7A1F2B] font-semibold text-sm hover:bg-[#FAF2E8]"
                >
                  Cancel
                </button>
                <GradientButton type="submit" className={submitting ? 'opacity-50' : ''}>
                  {submitting ? 'Creating...' : 'Save Acquirer Gateway'}
                </GradientButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </PayVangLayout>
  );
}
