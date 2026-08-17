import React, { useEffect, useMemo, useState } from 'react';
import PayVangLayout from '../components/layout/PayVangLayout';
import StatCard from '../components/common/StatCard';
import { Activity, RefreshCw, Search, Globe, BarChart3 } from 'lucide-react';
import { metricsApi, unwrapList } from '../api';

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

function normalizeStatusHits(payload) {
  if (!payload || typeof payload !== 'object') return [];
  const source = payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)
    ? payload.data
    : payload;
  const list = unwrapList(source);
  if (list.length) {
    return list.map((item) => ({
      status: String(item.status ?? item.code ?? item.httpStatus ?? '—'),
      hits: Number(item.hits ?? item.count ?? 0),
    }));
  }
  return Object.entries(source)
    .filter(([key, value]) => /^\d{3}$/.test(String(key)) && Number.isFinite(Number(value)))
    .map(([status, hits]) => ({ status, hits: Number(hits) }))
    .sort((a, b) => a.status.localeCompare(b.status));
}

function statusColor(status) {
  if (status.startsWith('2')) return { bg: 'rgba(22,163,74,0.1)', color: '#16a34a', border: 'rgba(22,163,74,0.25)' };
  if (status.startsWith('4')) return { bg: 'rgba(217,119,6,0.1)', color: '#d97706', border: 'rgba(217,119,6,0.25)' };
  if (status.startsWith('5')) return { bg: 'rgba(220,38,38,0.1)', color: '#dc2626', border: 'rgba(220,38,38,0.25)' };
  return { bg: 'rgba(122,31,43,0.08)', color: '#7A1F2B', border: 'rgba(122,31,43,0.2)' };
}

export default function MetricsPage() {
  const [totalHits, setTotalHits] = useState(null);
  const [urlHits, setUrlHits] = useState([]);
  const [statusHits, setStatusHits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    Promise.all([
      metricsApi.getTotalHits(),
      metricsApi.getHitsPerUrl(),
      metricsApi.getHitsPerStatus(),
    ])
      .then(([t, u, s]) => {
        const totalPayload = t?.data && typeof t.data === 'object' ? t.data : t;
        setTotalHits({
          totalHits: Number(totalPayload?.totalHits ?? totalPayload?.hits ?? 0),
          uptimePercentage: totalPayload?.uptimePercentage || totalPayload?.uptime || '—',
        });
        setUrlHits(
          unwrapList(u).map((h) => ({
            url: h.url || h.endpoint || h.path || '—',
            hits: Number(h.hits ?? h.count ?? 0),
          }))
        );
        setStatusHits(normalizeStatusHits(s));
      })
      .catch((err) => {
        console.error(err);
        setTotalHits(null);
        setUrlHits([]);
        setStatusHits([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredUrls = useMemo(() => {
    const query = searchInput.trim().toLowerCase();
    if (!query) return urlHits;
    return urlHits.filter((h) => h.url.toLowerCase().includes(query));
  }, [urlHits, searchInput]);

  const maxHits = Math.max(...filteredUrls.map((h) => h.hits), 0);

  return (
    <PayVangLayout title="System Metrics & Traffic" subtitle="Real-time API gateway URL hits, HTTP status breakdown & uptime telemetry.">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {loading && !totalHits ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 24,
              padding: 48,
              border: '1px solid rgba(122, 31, 43, 0.12)',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <RefreshCw className="w-7 h-7 text-[#7A1F2B] animate-spin" />
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
              <StatCard
                title="Total API Gateway Hits"
                value={(totalHits?.totalHits ?? 0).toLocaleString()}
                badgeText="Telemetry Live"
                badgeType="maroon"
              />
              <StatCard
                title="Platform Uptime"
                value={totalHits?.uptimePercentage || '—'}
                badgeText="High Availability"
                badgeType="green"
              />
            </div>

            {statusHits.length > 0 && (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 24,
                  padding: 32,
                  border: '1px solid rgba(122, 31, 43, 0.12)',
                  boxShadow: '0 4px 20px rgba(122, 31, 43, 0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <BarChart3 style={{ width: 20, height: 20, color: '#7A1F2B' }} />
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
                      HTTP Status Breakdown
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b5a56' }}>
                      Gateway response codes across all endpoints
                    </p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                  {statusHits.map((item) => {
                    const tone = statusColor(item.status);
                    return (
                      <div
                        key={item.status}
                        style={{
                          padding: '16px 18px',
                          backgroundColor: '#FBF8F2',
                          borderRadius: 16,
                          border: '1px solid rgba(122, 31, 43, 0.08)',
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-block',
                            fontSize: 11.5,
                            fontWeight: 800,
                            padding: '3px 10px',
                            borderRadius: 999,
                            backgroundColor: tone.bg,
                            color: tone.color,
                            border: `1px solid ${tone.border}`,
                          }}
                        >
                          {item.status}
                        </span>
                        <div
                          style={{
                            marginTop: 10,
                            fontSize: 22,
                            fontWeight: 800,
                            color: '#241417',
                            fontFamily: "'Space Grotesk', sans-serif",
                          }}
                        >
                          {item.hits.toLocaleString()}
                        </div>
                        <div style={{ fontSize: 12, color: '#9E8984', marginTop: 2 }}>requests</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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
                  marginBottom: 20,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Activity style={{ width: 20, height: 20, color: '#7A1F2B', flexShrink: 0 }} />
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
                      API Hits Per Endpoint URL
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b5a56' }}>
                      Request volume grouped by gateway path
                    </p>
                  </div>
                </div>
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
                  placeholder="Search endpoint URL..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#FAF2E8',
                    border: '1px solid rgba(122, 31, 43, 0.15)',
                    color: '#241417',
                    fontSize: 13,
                    borderRadius: 9999,
                    paddingLeft: 42,
                    paddingRight: 16,
                    height: 42,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {filteredUrls.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '48px 0',
                    backgroundColor: '#FAF2E8',
                    borderRadius: 16,
                    border: '1px solid rgba(122, 31, 43, 0.1)',
                  }}
                >
                  <Globe className="w-10 h-10 text-[#9E8984] mx-auto" />
                  <h4 style={{ fontSize: 16, fontWeight: 800, color: '#7A1F2B', margin: '12px 0 4px 0' }}>
                    No Data Found
                  </h4>
                  <p style={{ fontSize: 12, color: '#6b5a56', margin: 0 }}>
                    {searchInput.trim()
                      ? 'Try a different endpoint search term.'
                      : 'No API hit telemetry is available yet.'}
                  </p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto', borderRadius: 16, border: '1px solid rgba(122, 31, 43, 0.12)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#FAF2E8', borderBottom: '1px solid rgba(122, 31, 43, 0.12)' }}>
                        <th style={thStyle}>Endpoint URL</th>
                        <th style={{ ...thStyle, width: '42%' }}>Total Request Hits</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUrls.map((h, index) => (
                        <tr
                          key={`${h.url}-${index}`}
                          style={{
                            borderBottom:
                              index === filteredUrls.length - 1 ? 'none' : '1px solid rgba(122, 31, 43, 0.06)',
                            backgroundColor: '#ffffff',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#FBF8F2';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#ffffff';
                          }}
                        >
                          <td
                            style={{
                              ...tdStyle,
                              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                              fontWeight: 700,
                              color: '#7A1F2B',
                              fontSize: 13,
                            }}
                          >
                            {h.url}
                          </td>
                          <td style={tdStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div
                                style={{
                                  flex: 1,
                                  height: 8,
                                  borderRadius: 999,
                                  backgroundColor: '#FAF2E8',
                                  overflow: 'hidden',
                                  minWidth: 80,
                                }}
                              >
                                <div
                                  style={{
                                    width: maxHits ? `${Math.max((h.hits / maxHits) * 100, 4)}%` : '0%',
                                    height: '100%',
                                    borderRadius: 999,
                                    background: 'linear-gradient(90deg, #7A1F2B 0%, #C99A3D 100%)',
                                  }}
                                />
                              </div>
                              <span style={{ fontWeight: 800, color: '#241417', fontSize: 13, whiteSpace: 'nowrap' }}>
                                {h.hits.toLocaleString()} hits
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </PayVangLayout>
  );
}
