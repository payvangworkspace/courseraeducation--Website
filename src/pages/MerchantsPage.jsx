import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PayVangLayout from '../components/layout/PayVangLayout';
import { Search, Plus, ChevronLeft, ChevronRight, RefreshCw, Building2, Phone, Calendar, Mail, CircleUser } from 'lucide-react';
import { merchantApi, unwrapList } from '../api';

const PAGE_SIZE = 25;

const thStyle = {
  padding: '14px 20px',
  fontWeight: 800,
  fontSize: '11.5px',
  color: '#7A1F2B',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  whiteSpace: 'nowrap',
  verticalAlign: 'middle',
};

const tdStyle = {
  padding: '18px 20px',
  verticalAlign: 'middle',
};

function pickFirst(...values) {
  for (const value of values) {
    if (value !== null && value !== undefined && String(value).trim() !== '') {
      return String(value).trim();
    }
  }
  return '';
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

function toTitleCase(value) {
  if (!value) return '';
  return value
    .toLowerCase()
    .replace(/\b([a-z])/g, (char) => char.toUpperCase());
}

function formatPhone(value) {
  const raw = pickFirst(value);
  if (!raw) return '—';
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return raw;
}

function formatRegisteredDate(value) {
  const raw = pickFirst(value);
  if (!raw) return '—';
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function getTotalCount(res) {
  if (!res || typeof res !== 'object' || Array.isArray(res)) return null;
  const nested = res.data && typeof res.data === 'object' && !Array.isArray(res.data) ? res.data : {};
  const candidates = [
    res.total,
    res.recordsTotal,
    res.totalElements,
    res.totalCount,
    res.count,
    nested.total,
    nested.recordsTotal,
    nested.totalElements,
    nested.totalCount,
  ];
  for (const candidate of candidates) {
    const n = Number(candidate);
    if (Number.isFinite(n) && n >= 0) return n;
  }
  return null;
}

function normalizeMerchant(m) {
  const email = pickFirst(m.email, m.emailId, m.emailID, isEmail(m.userId) ? m.userId : '');
  const username = pickFirst(m.userName, m.username, m.loginId, m.login);
  const id = pickFirst(m.userId, m.id, m.merchantId, email);
  const name = toTitleCase(pickFirst(m.fullName, m.name)) || '—';
  const distinctUsername = username && username !== email && !isEmail(username) ? username : '';

  const businessName = toTitleCase(pickFirst(m.businessName, m.companyName, m.business)) || '—';
  const contactNumber = formatPhone(m.contactNumber || m.phone || m.mobile || m.phoneNumber);

  return {
    id: id || name,
    name,
    email: email || '—',
    username: distinctUsername,
    contactNumber,
    businessName,
    registrationDate: formatRegisteredDate(
      m.registrationDate || m.createdOn || m.createdDate || m.createdAt || m.createDate
    ),
    activationDate: formatRegisteredDate(
      m.activationDate || m.activatedOn || m.verificationDate || m.verifiedOn || m.verifiedDate
    ),
    searchText: [name, email, businessName, distinctUsername, contactNumber, id]
      .join(' ')
      .toLowerCase(),
  };
}

function matchesKeyword(merchant, keyword) {
  const query = String(keyword || '').trim().toLowerCase();
  if (!query) return true;
  return merchant.searchText.includes(query);
}

export default function MerchantsPage() {
  const navigate = useNavigate();
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(searchInput.trim());
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;

    const fetchMerchants = async () => {
      setLoading(true);
      try {
        const start = (currentPage - 1) * PAGE_SIZE;
        const res = await merchantApi.getAllMerchantList({
          start,
          size: String(PAGE_SIZE),
          keyword,
        });
        if (cancelled) return;

        const list = unwrapList(res).map(normalizeMerchant);
        const knownTotal = getTotalCount(res);
        const loaded = start + list.length;
        setMerchants(list);
        setTotalCount(knownTotal ?? loaded);
        setHasMore(list.length === PAGE_SIZE && (knownTotal == null || knownTotal > loaded));
      } catch (err) {
        console.error('Error fetching merchants:', err);
        if (!cancelled) {
          setMerchants([]);
          setTotalCount(0);
          setHasMore(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMerchants();
    return () => {
      cancelled = true;
    };
  }, [keyword, currentPage]);

  const filteredMerchants = useMemo(
    () => merchants.filter((merchant) => matchesKeyword(merchant, searchInput)),
    [merchants, searchInput]
  );

  const isFiltering = Boolean(searchInput.trim());
  const visibleCount = filteredMerchants.length;
  const displayTotal = isFiltering ? visibleCount : totalCount;
  const startIndex = visibleCount === 0 ? 0 : (isFiltering ? 1 : (currentPage - 1) * PAGE_SIZE + 1);
  const endIndex = isFiltering ? visibleCount : Math.min((currentPage - 1) * PAGE_SIZE + merchants.length, totalCount);
  const totalPages = Math.max(1, Math.ceil((totalCount || 1) / PAGE_SIZE));
  const canPrev = !isFiltering && currentPage > 1;
  const canNext = !isFiltering && (currentPage < totalPages || hasMore);

  return (
    <PayVangLayout title="User Management - Merchants" subtitle="Registered merchant accounts, API keys & business onboarding profiles.">
      <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', border: '1px solid rgba(122, 31, 43, 0.12)', boxShadow: '0 4px 20px rgba(122, 31, 43, 0.04)', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#7A1F2B', fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}>Merchant Accounts</h3>
            <p style={{ fontSize: '13px', color: '#6b5a56', margin: '4px 0 0 0' }}>Search, review and onboard merchant profiles</p>
          </div>
          <button
            onClick={() => navigate('/home/user-management/merchants/add-merchant')}
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
              boxShadow: '0 4px 12px rgba(122, 31, 43, 0.2)',
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Add Merchant</span>
          </button>
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '360px', marginBottom: '20px' }}>
          <Search style={{ width: '16px', height: '16px', color: '#9E8984', position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search name, email or business..."
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
        ) : filteredMerchants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', backgroundColor: '#FAF2E8', borderRadius: '16px', border: '1px solid rgba(122, 31, 43, 0.1)' }}>
            <Building2 className="w-10 h-10 text-[#9E8984] mx-auto" />
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#7A1F2B', margin: '12px 0 4px 0' }}>No Merchants Found</h4>
            <p style={{ fontSize: '12px', color: '#6b5a56', margin: 0 }}>
              {searchInput.trim() ? 'Try a different search term, or add a new merchant.' : 'Add a new merchant to get started.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid rgba(122, 31, 43, 0.12)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF2E8', borderBottom: '1px solid rgba(122, 31, 43, 0.12)' }}>
                  <th style={thStyle}>Merchant Name</th>
                  <th style={thStyle}>Contact Number</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Business Name</th>
                  <th style={thStyle}>Registration Date</th>
                  <th style={thStyle}>Activation Date</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMerchants.map((m, index) => (
                  <tr
                    key={m.id}
                    style={{
                      borderBottom: index === filteredMerchants.length - 1 ? 'none' : '1px solid rgba(122, 31, 43, 0.06)',
                      backgroundColor: '#ffffff',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FBF8F2';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                  >
                    <td style={{ ...tdStyle, fontWeight: 700, color: '#241417' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(122, 31, 43, 0.1)',
                            color: '#7A1F2B',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '13px',
                            flexShrink: 0,
                          }}
                        >
                          {m.name.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ lineHeight: 1.3 }}>{m.name}</div>
                          {m.username ? (
                            <span style={{ fontSize: '11px', color: '#9E8984', fontWeight: 500 }}>@{m.username}</span>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, color: '#6b5a56', fontSize: '13px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Phone style={{ width: '14px', height: '14px', color: '#9E8984', flexShrink: 0 }} />
                        <span>{m.contactNumber}</span>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                        <Mail style={{ width: '14px', height: '14px', color: '#9E8984', flexShrink: 0 }} />
                        <span
                          style={{
                            color: '#7A1F2B',
                            fontSize: '13px',
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                          title={m.email}
                        >
                          {m.email}
                        </span>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 600, color: '#7A1F2B', fontSize: '13px' }}>
                      {m.businessName}
                    </td>
                    <td style={{ ...tdStyle, color: '#6b5a56', fontSize: '13px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar style={{ width: '14px', height: '14px', color: '#9E8984', flexShrink: 0 }} />
                        <span>{m.registrationDate}</span>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, color: '#6b5a56', fontSize: '13px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar style={{ width: '14px', height: '14px', color: '#9E8984', flexShrink: 0 }} />
                        <span>{m.activationDate}</span>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <button
                        type="button"
                        title="View merchant profile"
                        aria-label={`View ${m.name}`}
                        onClick={() =>
                          navigate(`/home/user-management/merchants/${encodeURIComponent(m.id)}`, {
                            state: { merchant: m },
                          })
                        }
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          border: '1px solid rgba(122, 31, 43, 0.18)',
                          background: 'linear-gradient(135deg, rgba(122, 31, 43, 0.1) 0%, rgba(201, 154, 61, 0.16) 100%)',
                          color: '#7A1F2B',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(122, 31, 43, 0.08)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #7A1F2B 0%, #C99A3D 100%)';
                          e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(122, 31, 43, 0.1) 0%, rgba(201, 154, 61, 0.16) 100%)';
                          e.currentTarget.style.color = '#7A1F2B';
                        }}
                      >
                        <CircleUser style={{ width: 18, height: 18 }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredMerchants.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '20px', marginTop: '16px', fontSize: '12px', color: '#6b5a56', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              Showing <strong style={{ color: '#241417' }}>{startIndex}</strong> to{' '}
              <strong style={{ color: '#241417' }}>{endIndex}</strong> of{' '}
              <strong style={{ color: '#7A1F2B' }}>{displayTotal}</strong> merchants
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                disabled={!canPrev}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                style={{
                  padding: '6px 12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(122,31,43,0.15)',
                  backgroundColor: canPrev ? '#ffffff' : '#FAF2E8',
                  color: canPrev ? '#7A1F2B' : '#9E8984',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: canPrev ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>
              <span style={{ fontWeight: 700, color: '#7A1F2B', padding: '0 8px' }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={!canNext}
                onClick={() => setCurrentPage((p) => p + 1)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(122,31,43,0.15)',
                  backgroundColor: canNext ? '#ffffff' : '#FAF2E8',
                  color: canNext ? '#7A1F2B' : '#9E8984',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: canNext ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </PayVangLayout>
  );
}
