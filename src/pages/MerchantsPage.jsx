import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PayVangLayout from '../components/layout/PayVangLayout';
import { Search, Plus, ChevronLeft, ChevronRight, RefreshCw, Building2, Phone, Calendar, User } from 'lucide-react';

export default function MerchantsPage() {
  const navigate = useNavigate();
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchMerchants = (query = '') => {
    setLoading(true);
    fetch(`/api/merchants?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        setMerchants(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching merchants:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMerchants(searchQuery);
  }, [searchQuery]);

  // Pagination Math
  const totalPages = Math.ceil(merchants.length / itemsPerPage) || 1;
  const paginatedMerchants = merchants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <PayVangLayout title="User Management - Merchants" subtitle="Registered merchant accounts, API keys & business onboarding profiles.">
      <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', border: '1px solid rgba(122, 31, 43, 0.12)', boxShadow: '0 4px 20px rgba(122, 31, 43, 0.04)', marginBottom: '28px' }}>
        {/* HEADER CONTROLS: SEARCH & ADD BUTTON */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '340px' }}>
            <Search style={{ width: '16px', height: '16px', color: '#9E8984', position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search merchants, business..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
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
                boxSizing: 'border-box'
              }}
            />
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
              boxShadow: '0 4px 12px rgba(122, 31, 43, 0.2)'
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Add Merchant</span>
          </button>
        </div>

        {/* TABLE WRAPPER */}
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 0' }}>
            <RefreshCw className="w-7 h-7 text-[#7A1F2B] animate-spin" />
          </div>
        ) : merchants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', backgroundColor: '#FAF2E8', borderRadius: '16px', border: '1px solid rgba(122, 31, 43, 0.1)' }}>
            <Building2 className="w-10 h-10 text-[#9E8984] mx-auto" />
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#7A1F2B', margin: '12px 0 4px 0' }}>No Merchants Found</h4>
            <p style={{ fontSize: '12px', color: '#6b5a56', margin: 0 }}>Try adjusting your search criteria or add a new merchant.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid rgba(122, 31, 43, 0.12)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF2E8', borderBottom: '1px solid rgba(122, 31, 43, 0.12)' }}>
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Merchant Name</th>
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact Number</th>
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Username</th>
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Business Name</th>
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Registration Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMerchants.map((m) => (
                  <tr key={m.id} style={{ borderBottom: '1px solid rgba(122, 31, 43, 0.06)' }}>
                    <td style={{ padding: '16px 20px', fontWeight: 700, color: '#241417' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(122, 31, 43, 0.1)', color: '#7A1F2B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '12px', flexShrink: 0 }}>
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <div>{m.name}</div>
                          <span style={{ fontSize: '10.5px', color: '#9E8984', fontWeight: 500 }}>{m.id}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#6b5a56', fontSize: '13px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Phone style={{ width: '14px', height: '14px', color: '#9E8984' }} />
                        <span>{m.contactNumber}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ backgroundColor: '#FBF3E7', color: '#7A1F2B', border: '1px solid rgba(122, 31, 43, 0.15)', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600 }}>
                        {m.username}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: 600, color: '#7A1F2B', fontSize: '13px' }}>
                      {m.businessName}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#6b5a56', fontSize: '13px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar style={{ width: '14px', height: '14px', color: '#9E8984' }} />
                        <span>{m.registrationDate}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION FOOTER */}
        {!loading && merchants.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '20px', marginTop: '16px', fontSize: '12px', color: '#6b5a56', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              Showing <strong style={{ color: '#241417' }}>{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
              <strong style={{ color: '#241417' }}>{Math.min(currentPage * itemsPerPage, merchants.length)}</strong> of{' '}
              <strong style={{ color: '#7A1F2B' }}>{merchants.length}</strong> merchants
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                style={{
                  padding: '6px 12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(122,31,43,0.15)',
                  backgroundColor: currentPage === 1 ? '#FAF2E8' : '#ffffff',
                  color: currentPage === 1 ? '#9E8984' : '#7A1F2B',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>
              <span style={{ fontWeight: 700, color: '#7A1F2B', padding: '0 8px' }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                style={{
                  padding: '6px 12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(122,31,43,0.15)',
                  backgroundColor: currentPage === totalPages ? '#FAF2E8' : '#ffffff',
                  color: currentPage === totalPages ? '#9E8984' : '#7A1F2B',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
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
