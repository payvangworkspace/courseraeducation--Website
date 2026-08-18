import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PayVangLayout from '../components/layout/PayVangLayout';
import { Building2, Plus, Search, RefreshCw, Pencil, X, Mail } from 'lucide-react';
import { apiMasterApi, unwrapList } from '../api';

function normalizeAcquirer(a) {
  const aggregatorCode = a.aggregatorCode || a.acquirerCode || a.code || '—';
  const apiName = a.apiName || a.fullName || a.name || '—';
  const id = a.id || a.apiId || aggregatorCode;

  return {
    ...a,
    id,
    aggregatorCode,
    apiName,
    httpMethod: a.httpMethod || '—',
    type: a.type || '—',
    environment: a.environment || '—',
    active: a.active !== false,
    searchText: [aggregatorCode, apiName, a.httpMethod, a.type, a.environment]
      .filter(Boolean)
      .join(' ')
      .toLowerCase(),
  };
}

function matchesKeyword(acquirer, keyword) {
  const query = String(keyword || '').trim().toLowerCase();
  if (!query) return true;
  return acquirer.searchText.includes(query);
}

const thStyle = {
  padding: '14px 20px',
  fontWeight: 800,
  fontSize: '11.5px',
  color: '#7A1F2B',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const editFieldStyle = {
  width: '100%',
  height: 44,
  boxSizing: 'border-box',
  border: '1px solid rgba(122,31,43,.2)',
  borderRadius: 10,
  backgroundColor: '#fff',
  color: '#241417',
  fontSize: 13.5,
  padding: '0 14px',
  outline: 'none',
};

const editLabelStyle = {
  display: 'block',
  marginBottom: 7,
  color: '#7A1F2B',
  fontSize: 11.5,
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '.04em',
};

export default function AcquirersPage() {
  const navigate = useNavigate();
  const [acquirers, setAcquirers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState('');
  const [editForm, setEditForm] = useState({});

  const fetchAcquirers = async () => {
    setLoading(true);
    try {
      const res = await apiMasterApi.getAllApi();
      setAcquirers(unwrapList(res).map(normalizeAcquirer));
    } catch (err) {
      console.error('Error fetching API masters:', err);
      setAcquirers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchAcquirers, 0);
    return () => clearTimeout(timer);
  }, []);

  const filteredAcquirers = useMemo(
    () => acquirers.filter((acquirer) => matchesKeyword(acquirer, searchInput)),
    [acquirers, searchInput]
  );

  const openEdit = async (acquirer) => {
    setEditOpen(true);
    setEditLoading(true);
    setEditError('');
    setEditForm(acquirer);
    try {
      const response = await apiMasterApi.getApiById(acquirer.id);
      const detail = response?.data && typeof response.data === 'object' ? response.data : response;
      if (detail && typeof detail === 'object') setEditForm({ ...acquirer, ...detail });
    } catch (error) {
      setEditError(error.message || 'Unable to load acquirer configuration.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((previous) => ({ ...previous, [name]: name === 'active' ? value === 'true' : value }));
    setEditError('');
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    const required = ['baseUrl', 'clientId', 'endpoint', 'merchantId', 'responsekey', 'secretKey', 'webhoockUrl'];
    if (required.some((key) => !String(editForm[key] ?? '').trim())) {
      setEditError('Please complete all required configuration fields.');
      return;
    }

    setEditSubmitting(true);
    setEditError('');
    try {
      await apiMasterApi.updateApiMaster(editForm);
      setEditOpen(false);
      await fetchAcquirers();
    } catch (error) {
      setEditError(error.message || 'Failed to update acquirer configuration.');
    } finally {
      setEditSubmitting(false);
    }
  };

  return (
    <PayVangLayout title="User Management - Acquirers" subtitle="Acquiring gateway integrations, bank switches & payout routes.">
      <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', border: '1px solid rgba(122, 31, 43, 0.12)', boxShadow: '0 4px 20px rgba(122, 31, 43, 0.04)', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#7A1F2B', fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}>Acquirer Switches & Connectors</h3>
            <p style={{ fontSize: '13px', color: '#6b5a56', margin: '4px 0 0 0' }}>Direct bank integrations, payin gateways & payout routes</p>
          </div>

          <button
            onClick={() => navigate('/home/user-management/acquirers/add-acquirer')}
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
            placeholder="Search acquirer code or name..."
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
                  <th style={thStyle}>Aggregator Code</th>
                  <th style={thStyle}>API Name</th>
                  <th style={thStyle}>HTTP Method</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Environment</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Actions</th>
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
                      <span style={{ fontSize: '11.5px', fontWeight: 800, padding: '4px 10px', borderRadius: '6px', backgroundColor: 'rgba(122,31,43,0.1)', color: '#7A1F2B' }}>{acq.httpMethod}</span>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#6b5a56' }}>{acq.type}</td>
                    <td style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#6b5a56' }}>{acq.environment}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 800, padding: '4px 10px', borderRadius: '9999px', border: '1px solid transparent', backgroundColor: acq.active ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)', color: acq.active ? '#16a34a' : '#dc2626', borderColor: acq.active ? 'rgba(22,163,74,0.25)' : 'rgba(220,38,38,0.25)' }}>
                        {acq.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <button
                        onClick={() => openEdit(acq)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#7A1F2B', fontWeight: 700, fontSize: '12px', cursor: 'pointer', padding: 0 }}
                      >
                        <Pencil style={{ width: '13px', height: '13px' }} /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editOpen && (
        <div
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setEditOpen(false);
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            backgroundColor: 'rgba(36,20,23,.55)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Edit Acquirer Configuration"
            style={{
              width: 'min(640px, 100%)',
              height: '100%',
              overflowY: 'auto',
              backgroundColor: '#fff',
              boxShadow: '-16px 0 40px rgba(36,20,23,.2)',
              padding: '28px 32px',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 18,
                paddingBottom: 20,
                marginBottom: 24,
                borderBottom: '1px solid rgba(122,31,43,.12)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Mail style={{ width: 21, height: 21, color: '#9E8984' }} />
                  <h2 style={{ margin: 0, fontSize: 21, fontWeight: 800, color: '#7A1F2B' }}>
                    Edit Acquirer Configuration
                  </h2>
                </div>
                <p style={{ margin: '7px 0 0 31px', color: '#6b5a56', fontSize: 12.5 }}>
                  {editForm.aggregatorCode || '—'} · {editForm.apiName || '—'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                aria-label="Close edit configuration"
                style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(122,31,43,.14)', background: '#FAF2E8', color: '#7A1F2B', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
              >
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            {editLoading ? (
              <div style={{ minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RefreshCw className="w-7 h-7 text-[#7A1F2B] animate-spin" />
              </div>
            ) : (
              <form onSubmit={handleEditSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 19 }}>
                  {[
                    ['baseUrl', 'Base URL', 'https://gateway.example.com'],
                    ['clientId', 'Client ID', 'Enter client ID'],
                    ['endpoint', 'Endpoint', '/api/v1/payin/create'],
                    ['merchantId', 'Merchant ID', 'Enter merchant ID'],
                    ['responsekey', 'Response Key', 'Enter response key'],
                    ['secretKey', 'Secret Key', 'Enter secret key'],
                    ['webhoockUrl', 'Webhook URL', 'https://courseraeducation.com/webhook'],
                  ].map(([name, label, placeholder]) => (
                    <div key={name}>
                      <label style={editLabelStyle}>
                        {label}<span style={{ color: '#C99A3D', marginLeft: 4 }}>*</span>
                      </label>
                      <input
                        type="text"
                        name={name}
                        value={editForm[name] ?? ''}
                        onChange={handleEditChange}
                        placeholder={placeholder}
                        style={editFieldStyle}
                        onFocus={(event) => {
                          event.target.style.borderColor = '#7A1F2B';
                          event.target.style.boxShadow = '0 0 0 3px rgba(122,31,43,.12)';
                        }}
                        onBlur={(event) => {
                          event.target.style.borderColor = 'rgba(122,31,43,.2)';
                          event.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  ))}

                  <div>
                    <label style={editLabelStyle}>
                      Status<span style={{ color: '#C99A3D', marginLeft: 4 }}>*</span>
                    </label>
                    <select name="active" value={String(editForm.active !== false)} onChange={handleEditChange} style={editFieldStyle}>
                      <option value="true">ACTIVE</option>
                      <option value="false">INACTIVE</option>
                    </select>
                  </div>
                </div>

                {editError && (
                  <div style={{ marginTop: 20, padding: '12px 14px', borderRadius: 10, color: '#b91c1c', background: 'rgba(220,38,38,.08)', border: '1px solid rgba(220,38,38,.22)', fontSize: 12.5, fontWeight: 600 }}>
                    {editError}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(122,31,43,.12)', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setEditOpen(false)}
                    style={{ height: 42, padding: '0 22px', borderRadius: 9999, border: '1px solid rgba(122,31,43,.2)', background: '#fff', color: '#7A1F2B', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={editSubmitting}
                    style={{ height: 42, padding: '0 24px', borderRadius: 9999, border: 0, background: editSubmitting ? 'rgba(122,31,43,.45)' : 'linear-gradient(135deg,#7A1F2B 0%,#C99A3D 100%)', color: '#fff', fontWeight: 700, fontSize: 13, cursor: editSubmitting ? 'not-allowed' : 'pointer' }}
                  >
                    {editSubmitting ? 'Updating...' : 'Update Acquirer Details'}
                  </button>
                </div>
              </form>
            )}
          </aside>
        </div>
      )}
    </PayVangLayout>
  );
}
