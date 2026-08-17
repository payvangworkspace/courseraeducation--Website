import React, { useEffect, useMemo, useState } from 'react';
import PayVangLayout from '../components/layout/PayVangLayout';
import { ShieldCheck, Plus, RefreshCw, Trash2, Search } from 'lucide-react';
import { ipKeyApi, unwrapList } from '../api';

function normalizeIp(ip, idx) {
  const id = ip.id || ip.keyId || idx;
  const merchantId = ip.merchantId || ip.userId || '—';
  const ipAddress = ip.ipAddress || ip.ip || ip.whitelistIp || '—';
  const systemName = ip.systemName || ip.name || ip.label || '—';
  const ipAddressDesc = ip.ipAddressDesc || ip.description || ip.desc || '—';

  return {
    id,
    merchantId,
    ipAddress,
    systemName,
    ipAddressDesc,
    searchText: [id, merchantId, ipAddress, systemName, ipAddressDesc].join(' ').toLowerCase(),
  };
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

export default function IPWhitelistPage() {
  const [ipList, setIpList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    ipKeyApi
      .getIpKeyList()
      .then((data) => setIpList(unwrapList(data).map(normalizeIp)))
      .catch((err) => {
        console.error(err);
        setIpList([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredList = useMemo(() => {
    const query = searchInput.trim().toLowerCase();
    if (!query) return ipList;
    return ipList.filter((ip) => ip.searchText.includes(query));
  }, [ipList, searchInput]);

  return (
    <PayVangLayout title="IP Whitelist & Egress" subtitle="Allowed merchant API server IP addresses & payout egress whitelists.">
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 24,
          padding: 32,
          border: '1px solid rgba(122, 31, 43, 0.12)',
          boxShadow: '0 4px 20px rgba(122, 31, 43, 0.04)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 24,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: 'rgba(122, 31, 43, 0.08)',
                color: '#7A1F2B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ShieldCheck style={{ width: 20, height: 20 }} />
            </div>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 800,
                  color: '#7A1F2B',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Whitelisted Ingress IP Addresses
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b5a56' }}>
                Allowlisted merchant API origins and payout egress hosts
              </p>
            </div>
          </div>
          <button
            onClick={() => alert('Whitelisting new IP address...')}
            style={{
              height: 42,
              padding: '0 22px',
              borderRadius: 9999,
              background: 'linear-gradient(135deg, #7A1F2B 0%, #C99A3D 100%)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: 13,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(122, 31, 43, 0.2)',
              flexShrink: 0,
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Whitelist IP</span>
          </button>
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: 360, marginBottom: 20 }}>
          <Search
            style={{
              width: 16,
              height: 16,
              color: '#9E8984',
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
          <input
            type="text"
            placeholder="Search IP, merchant or system..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              width: '100%',
              height: 42,
              backgroundColor: '#FAF2E8',
              border: '1px solid rgba(122, 31, 43, 0.15)',
              color: '#241417',
              fontSize: 13,
              borderRadius: 9999,
              paddingLeft: 42,
              paddingRight: 16,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
            <RefreshCw className="w-7 h-7 text-[#7A1F2B] animate-spin" />
          </div>
        ) : filteredList.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '48px 16px',
              backgroundColor: '#FAF2E8',
              borderRadius: 16,
              border: '1px solid rgba(122, 31, 43, 0.1)',
            }}
          >
            <ShieldCheck className="w-10 h-10 text-[#9E8984] mx-auto" />
            <h4 style={{ fontSize: 16, fontWeight: 800, color: '#7A1F2B', margin: '12px 0 4px' }}>
              No Data Found
            </h4>
            <p style={{ fontSize: 12, color: '#6b5a56', margin: 0 }}>
              {searchInput.trim()
                ? 'Try a different search term, or whitelist a new IP address.'
                : 'No IP addresses are whitelisted yet. Add one to allow merchant API access.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', borderRadius: 16, border: '1px solid rgba(122, 31, 43, 0.12)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF2E8', borderBottom: '1px solid rgba(122, 31, 43, 0.12)' }}>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Merchant ID</th>
                  <th style={thStyle}>IP Address</th>
                  <th style={thStyle}>System Name</th>
                  <th style={thStyle}>Description</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((ip, index) => (
                  <tr
                    key={ip.id}
                    style={{
                      borderBottom: index === filteredList.length - 1 ? 'none' : '1px solid rgba(122, 31, 43, 0.06)',
                      backgroundColor: '#ffffff',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FBF8F2';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                  >
                    <td style={{ ...tdStyle, fontWeight: 700, color: '#7A1F2B' }}>{ip.id}</td>
                    <td style={{ ...tdStyle, fontWeight: 600, color: '#241417' }}>{ip.merchantId}</td>
                    <td
                      style={{
                        ...tdStyle,
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                        fontWeight: 700,
                        color: '#16a34a',
                      }}
                    >
                      {ip.ipAddress}
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 600, color: '#6b5a56' }}>{ip.systemName}</td>
                    <td style={{ ...tdStyle, fontSize: 12, color: '#9E8984' }}>{ip.ipAddressDesc}</td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => alert(`Revoking IP ${ip.ipAddress}`)}
                        title="Remove IP"
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 10,
                          border: '1px solid rgba(220, 38, 38, 0.2)',
                          backgroundColor: 'rgba(220, 38, 38, 0.08)',
                          color: '#dc2626',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
