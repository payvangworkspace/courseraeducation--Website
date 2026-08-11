import React, { useEffect, useState } from 'react';
import PayVangLayout from '../components/layout/PayVangLayout';
import { Coins, Plus, RefreshCw } from 'lucide-react';
import { cryptoConfigApi, unwrapList } from '../api';

function normalizeConfig(c, idx) {
  return {
    id: c.id || c.configId || `${c.merchantId || 'CFG'}-${idx}`,
    merchantId: c.merchantId || c.userId || '—',
    defaultCoin: c.defaultCoin || c.coin || c.coinType || '—',
    defaultNetwork: c.defaultNetwork || c.network || c.chain || '—',
    fiatCurrencyCode: c.fiatCurrencyCode || c.fiatCurrency || c.currency || '—',
    walletAddress: c.walletAddress || c.address || '—',
    active: c.active !== false && String(c.status || '').toLowerCase() !== 'inactive',
  };
}

export default function CryptoConfigPage() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cryptoConfigApi
      .listCryptoConfig()
      .then((data) => setConfigs(unwrapList(data).map(normalizeConfig)))
      .catch((err) => {
        console.error(err);
        setConfigs([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <PayVangLayout title="Crypto Config" subtitle="Crypto payment gateway parameters, coin mappings & wallet verification.">
      <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', border: '1px solid rgba(122, 31, 43, 0.12)', boxShadow: '0 4px 20px rgba(122, 31, 43, 0.04)', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Coins style={{ width: '22px', height: '22px', color: '#C99A3D' }} />
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#7A1F2B', fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}>Crypto Merchant Gateway Profiles</h3>
              <p style={{ fontSize: '12px', color: '#6b5a56', margin: '2px 0 0 0' }}>Blockchain network parameters & wallet endpoints</p>
            </div>
          </div>
          <button
            onClick={() => alert('Configuring new crypto coin gateway...')}
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
            <span>Add Crypto Config</span>
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
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Merchant ID</th>
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Default Coin</th>
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Default Network</th>
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fiat Currency</th>
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Wallet Address</th>
                  <th style={{ padding: '14px 20px', fontWeight: 800, fontSize: '11.5px', color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {configs.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid rgba(122, 31, 43, 0.06)' }}>
                    <td style={{ padding: '16px 20px', fontWeight: 700, color: '#7A1F2B' }}>{c.merchantId}</td>
                    <td style={{ padding: '16px 20px', fontWeight: 800, color: '#C99A3D', fontSize: '13.5px' }}>{c.defaultCoin}</td>
                    <td style={{ padding: '16px 20px', fontWeight: 700, color: '#16a34a', fontSize: '13px' }}>{c.defaultNetwork}</td>
                    <td style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: '#241417' }}>{c.fiatCurrencyCode}</td>
                    <td style={{ padding: '16px 20px', fontFamily: 'monospace', fontSize: '12px', color: '#6b5a56' }}>{c.walletAddress}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 800, padding: '4px 10px', borderRadius: '9999px', border: '1px solid transparent', backgroundColor: c.active ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)', color: c.active ? '#16a34a' : '#dc2626', borderColor: c.active ? 'rgba(22,163,74,0.25)' : 'rgba(220,38,38,0.25)' }}>
                        {c.active ? 'Active' : 'Inactive'}
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
