import React, { useEffect, useState } from 'react';
import PayVangLayout from '../components/layout/PayVangLayout';
import GradientButton from '../components/common/GradientButton';
import { Percent, ShieldAlert, Plus, RefreshCw, Layers } from 'lucide-react';

export default function FeeRulesPage() {
  const [feeRules, setFeeRules] = useState([]);
  const [limitRules, setLimitRules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/FeeLimitRule/GetAllFeeRules', { method: 'POST' }).then((r) => r.json()),
      fetch('/FeeLimitRule/GetLimitRules', { method: 'POST' }).then((r) => r.json())
    ])
      .then(([fData, lData]) => {
        setFeeRules(fData);
        setLimitRules(lData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <PayVangLayout title="Fee & Limit Rules" subtitle="Merchant transaction MDR fee matrices, commission caps & ticket size limits.">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* FEE RULES SECTION */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', border: '1px solid rgba(122, 31, 43, 0.12)', boxShadow: '0 4px 20px rgba(122, 31, 43, 0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', marginBottom: '28px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Percent style={{ width: '22px', height: '22px', color: '#7A1F2B' }} />
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#7A1F2B', fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}>Merchant Fee Rules</h3>
                <p style={{ fontSize: '12px', color: '#6b5a56', margin: '2px 0 0 0' }}>Percentage commission & MDR fee matrices</p>
              </div>
            </div>
            <button
              onClick={() => alert('Adding new MDR fee rule...')}
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
              <span>Add Fee Rule</span>
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
                    <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rule ID</th>
                    <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Merchant ID</th>
                    <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Txn Type</th>
                    <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fee Value</th>
                    <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Commission %</th>
                    <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cap Min / Max</th>
                    <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {feeRules.map((f) => (
                    <tr key={f.ruleId} style={{ borderBottom: '1px solid rgba(122, 31, 43, 0.06)' }}>
                      <td style={{ padding: '16px 20px', fontWeight: 700, color: '#7A1F2B' }}>{f.ruleId}</td>
                      <td style={{ padding: '16px 20px', fontWeight: 600, color: '#241417', fontSize: '13px' }}>{f.merchantId}</td>
                      <td style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#C99A3D' }}>{f.txnType}</td>
                      <td style={{ padding: '16px 20px', fontWeight: 800, color: '#241417', fontSize: '14px' }}>{f.feeValue}%</td>
                      <td style={{ padding: '16px 20px', fontWeight: 700, color: '#16a34a', fontSize: '13px' }}>{f.commissionPercent}%</td>
                      <td style={{ padding: '16px 20px', fontSize: '12px', color: '#6b5a56' }}>₹{f.capMin} - ₹{f.capMax}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontSize: '11.5px', fontWeight: 800, padding: '4px 10px', borderRadius: '9999px', border: '1px solid transparent', backgroundColor: f.active ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)', color: f.active ? '#16a34a' : '#dc2626', borderColor: f.active ? 'rgba(22,163,74,0.25)' : 'rgba(220,38,38,0.25)' }}>
                          {f.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* LIMIT RULES SECTION */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', border: '1px solid rgba(122, 31, 43, 0.12)', boxShadow: '0 4px 20px rgba(122, 31, 43, 0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', marginBottom: '28px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldAlert style={{ width: '22px', height: '22px', color: '#C99A3D' }} />
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#7A1F2B', fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}>Ticket Limit & Daily Caps</h3>
                <p style={{ fontSize: '12px', color: '#6b5a56', margin: '2px 0 0 0' }}>Per transaction limits, daily caps & monthly quotas</p>
              </div>
            </div>
            <button
              onClick={() => alert('Adding new volume limit rule...')}
              style={{
                height: '42px',
                padding: '0 24px',
                borderRadius: '9999px',
                backgroundColor: '#FAF2E8',
                color: '#7A1F2B',
                fontWeight: 700,
                fontSize: '13px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid rgba(122, 31, 43, 0.2)',
                cursor: 'pointer'
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Limit Rule</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid rgba(122, 31, 43, 0.12)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF2E8', borderBottom: '1px solid rgba(122, 31, 43, 0.12)' }}>
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Limit ID</th>
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Merchant ID</th>
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Txn Type</th>
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Per Txn Min / Max</th>
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Daily Cap</th>
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monthly Cap</th>
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {limitRules.map((l) => (
                  <tr key={l.limitId} style={{ borderBottom: '1px solid rgba(122, 31, 43, 0.06)' }}>
                    <td style={{ padding: '16px 20px', fontWeight: 700, color: '#7A1F2B' }}>{l.limitId}</td>
                    <td style={{ padding: '16px 20px', fontWeight: 600, color: '#241417', fontSize: '13px' }}>{l.merchantId}</td>
                    <td style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#C99A3D' }}>{l.txnType}</td>
                    <td style={{ padding: '16px 20px', fontSize: '13px', color: '#241417', fontWeight: 600 }}>₹{l.perTxnMin} - ₹{l.perTxnMax}</td>
                    <td style={{ padding: '16px 20px', fontWeight: 700, color: '#7A1F2B', fontSize: '13px' }}>₹{l.dailyCap}</td>
                    <td style={{ padding: '16px 20px', fontWeight: 700, color: '#7A1F2B', fontSize: '13px' }}>₹{l.monthlyCap}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 800, padding: '4px 10px', borderRadius: '9999px', border: '1px solid transparent', backgroundColor: l.active ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)', color: l.active ? '#16a34a' : '#dc2626', borderColor: l.active ? 'rgba(22,163,74,0.25)' : 'rgba(220,38,38,0.25)' }}>
                        {l.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PayVangLayout>
  );
}
