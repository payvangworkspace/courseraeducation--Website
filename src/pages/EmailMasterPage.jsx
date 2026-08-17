import React, { useEffect, useMemo, useState } from 'react';
import PayVangLayout from '../components/layout/PayVangLayout';
import { Mail, Plus, RefreshCw, Search } from 'lucide-react';
import { emailApi, unwrapList } from '../api';

function normalizeEmail(em, idx) {
  const emailCode = em.emailCode || em.code || '—';
  const fromEmail = em.fromEmail || em.from || em.sender || '—';
  const subject = em.subject || em.emailSubject || '—';
  const smtpHost = em.smtpHost || em.host || '—';
  const smtpPort = em.smtpPort || em.port || '—';
  const status = em.status || (em.active === false ? 'Inactive' : 'Active');

  return {
    id: em.id || em.emailCode || `EM-${idx}`,
    emailCode,
    fromEmail,
    subject,
    smtpHost,
    smtpPort,
    status,
    searchText: [emailCode, fromEmail, subject, smtpHost, smtpPort, status].join(' ').toLowerCase(),
  };
}

function matchesKeyword(email, keyword) {
  const query = String(keyword || '').trim().toLowerCase();
  if (!query) return true;
  return email.searchText.includes(query);
}

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
  padding: '16px 20px',
  verticalAlign: 'middle',
};

export default function EmailMasterPage() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    emailApi
      .getEmailMasterList({})
      .then((data) => setEmails(unwrapList(data).map(normalizeEmail)))
      .catch((err) => {
        console.error(err);
        setEmails([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredEmails = useMemo(
    () => emails.filter((email) => matchesKeyword(email, searchInput)),
    [emails, searchInput]
  );

  return (
    <PayVangLayout title="Email Master Templates" subtitle="System transactional email triggers, SMTP credentials & body templates.">
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '32px',
          border: '1px solid rgba(122, 31, 43, 0.12)',
          boxShadow: '0 4px 20px rgba(122, 31, 43, 0.04)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '24px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h3
              style={{
                fontSize: '20px',
                fontWeight: 800,
                color: '#7A1F2B',
                fontFamily: "'Space Grotesk', sans-serif",
                margin: 0,
              }}
            >
              SMTP Email Templates
            </h3>
            <p style={{ fontSize: '13px', color: '#6b5a56', margin: '4px 0 0 0' }}>
              Manage transactional triggers, sender addresses and SMTP hosts
            </p>
          </div>
          <button
            onClick={() => alert('Creating email template...')}
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
            <span>Add Email Template</span>
          </button>
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '360px', marginBottom: '20px' }}>
          <Search
            style={{
              width: '16px',
              height: '16px',
              color: '#9E8984',
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
          <input
            type="text"
            placeholder="Search code, email or subject..."
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
        ) : filteredEmails.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '48px 0',
              backgroundColor: '#FAF2E8',
              borderRadius: '16px',
              border: '1px solid rgba(122, 31, 43, 0.1)',
            }}
          >
            <Mail className="w-10 h-10 text-[#9E8984] mx-auto" />
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#7A1F2B', margin: '12px 0 4px 0' }}>
              No Data Found
            </h4>
            <p style={{ fontSize: '12px', color: '#6b5a56', margin: 0 }}>
              {searchInput.trim()
                ? 'Try a different search term, or add a new email template.'
                : 'No email templates available. Add a new template to get started.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid rgba(122, 31, 43, 0.12)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF2E8', borderBottom: '1px solid rgba(122, 31, 43, 0.12)' }}>
                  <th style={thStyle}>Email Code</th>
                  <th style={thStyle}>From Email</th>
                  <th style={thStyle}>Subject</th>
                  <th style={thStyle}>SMTP Host</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmails.map((em, index) => (
                  <tr
                    key={em.id}
                    style={{
                      borderBottom:
                        index === filteredEmails.length - 1 ? 'none' : '1px solid rgba(122, 31, 43, 0.06)',
                      backgroundColor: '#ffffff',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FBF8F2';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                  >
                    <td style={{ ...tdStyle, fontWeight: 700, color: '#7A1F2B' }}>{em.emailCode}</td>
                    <td style={{ ...tdStyle, fontWeight: 600, color: '#241417', fontSize: '13px' }}>{em.fromEmail}</td>
                    <td style={{ ...tdStyle, fontWeight: 600, color: '#C99A3D', fontSize: '13px' }}>{em.subject}</td>
                    <td style={{ ...tdStyle, fontSize: '12px', fontFamily: 'ui-monospace, monospace', color: '#6b5a56' }}>
                      {em.smtpHost}:{em.smtpPort}
                    </td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 800,
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          border: '1px solid transparent',
                          backgroundColor:
                            em.status === 'Active' ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)',
                          color: em.status === 'Active' ? '#16a34a' : '#dc2626',
                          borderColor:
                            em.status === 'Active' ? 'rgba(22,163,74,0.25)' : 'rgba(220,38,38,0.25)',
                        }}
                      >
                        {em.status}
                      </span>
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
