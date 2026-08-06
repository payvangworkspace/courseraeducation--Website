import React, { useEffect, useState } from 'react';
import PayVangLayout from '../components/layout/PayVangLayout';
import { Layers, Plus, RefreshCw, ArrowRightLeft } from 'lucide-react';

export default function AggregatorMappingPage() {
  const [mappings, setMappings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/apimasters/GetMerchantAggregatorMapping/ALL')
      .then((res) => res.json())
      .then((data) => {
        setMappings(data);
        setLoading(false);
      });
  }, []);

  return (
    <PayVangLayout title="Aggregator Mappings" subtitle="Map acquirer gateway switches to specific merchants with routing priority.">
      <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', border: '1px solid rgba(122, 31, 43, 0.12)', boxShadow: '0 4px 20px rgba(122, 31, 43, 0.04)', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#7A1F2B', fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}>Merchant Gateway Priorities</h3>
            <p style={{ fontSize: '13px', color: '#6b5a56', margin: '4px 0 0 0' }}>Cascading fallback & smart routing priority rules</p>
          </div>
          <button
            onClick={() => alert('Adding new merchant aggregator priority mapping...')}
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
            <span>Map Merchant Aggregator</span>
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
            <RefreshCw className="w-7 h-7 text-[#7A1F2B] animate-spin" />
          </div>
        ) : (
          <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid rgba(122, 31, 43, 0.12)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF2E8', borderBottom: '1px solid rgba(122, 31, 43, 0.12)' }}>
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mapping ID</th>
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Merchant ID</th>
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Aggregator Code</th>
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Environment</th>
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Txn Type</th>
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Priority</th>
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {mappings.map((m) => (
                  <tr key={m.id} style={{ borderBottom: '1px solid rgba(122, 31, 43, 0.06)' }}>
                    <td style={{ padding: '16px 20px', fontWeight: 700, color: '#7A1F2B' }}>{m.id}</td>
                    <td style={{ padding: '16px 20px', fontWeight: 600, color: '#241417', fontSize: '13px' }}>{m.merchantId}</td>
                    <td style={{ padding: '16px 20px', fontWeight: 800, color: '#C99A3D', fontSize: '13px' }}>{m.aggregatorCode}</td>
                    <td style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#6b5a56' }}>{m.environment}</td>
                    <td style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#16a34a' }}>{m.txnType}</td>
                    <td style={{ padding: '16px 20px', fontWeight: 800, color: '#7A1F2B', fontSize: '13px' }}>Priority #{m.priority}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 800, padding: '4px 10px', borderRadius: '9999px', border: '1px solid transparent', backgroundColor: m.active ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)', color: m.active ? '#16a34a' : '#dc2626', borderColor: m.active ? 'rgba(22,163,74,0.25)' : 'rgba(220,38,38,0.25)' }}>
                        {m.active ? 'Active' : 'Inactive'}
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
