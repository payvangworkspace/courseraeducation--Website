import React, { useEffect, useState } from 'react';
import PayVangLayout from '../components/layout/PayVangLayout';
import { Wallet, Plus, RefreshCw, Coins } from 'lucide-react';
import { walletApi, unwrapList } from '../api';

function toNumber(value) {
  if (value === null || value === undefined || value === '') return 0;
  const n = Number(String(value).replace(/[₹$,\s]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function normalizeFiat(w) {
  return {
    merchantId: w.merchantId || w.userId || w.id || '—',
    merchantName: w.merchantName || w.fullName || w.businessName || w.name || '—',
    balance: toNumber(w.netBalance ?? w.balance ?? w.availableBalance ?? w.amount),
    reservedBalance: toNumber(w.reservedBalance ?? w.reserved ?? w.escrow ?? 0),
    lastUpdated: w.lastUpdated || w.updatedOn || w.modifiedDate || w.createdOn || '—',
  };
}

function normalizeCrypto(cw) {
  return {
    merchantId: cw.merchantId || cw.userId || cw.id || '—',
    coinType: cw.coinType || cw.coin || cw.currency || '—',
    chainType: cw.chainType || cw.network || cw.chain || '—',
    walletAddress: cw.walletAddress || cw.address || '—',
    balance: toNumber(cw.balance ?? cw.cryptoBalance ?? 0),
    fiatValueUSD: toNumber(cw.fiatValueUSD ?? cw.fiatValue ?? cw.usdValue ?? 0),
  };
}

const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: 24,
  padding: 32,
  border: '1px solid rgba(122, 31, 43, 0.12)',
  boxShadow: '0 4px 20px rgba(122, 31, 43, 0.04)',
};

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

function EmptyState({ icon, title, message }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '48px 16px',
        backgroundColor: '#FAF2E8',
        borderRadius: 16,
        border: '1px solid rgba(122, 31, 43, 0.1)',
      }}
    >
      {icon}
      <h4 style={{ fontSize: 16, fontWeight: 800, color: '#7A1F2B', margin: '12px 0 4px' }}>{title}</h4>
      <p style={{ fontSize: 12, color: '#6b5a56', margin: 0 }}>{message}</p>
    </div>
  );
}

function DataTable({ columns, rows, rowKey }) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: 16, border: '1px solid rgba(122, 31, 43, 0.12)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#FAF2E8', borderBottom: '1px solid rgba(122, 31, 43, 0.12)' }}>
            {columns.map((col) => (
              <th key={col.key} style={thStyle}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={rowKey(row, index)}
              style={{
                borderBottom: index === rows.length - 1 ? 'none' : '1px solid rgba(122, 31, 43, 0.06)',
                backgroundColor: '#ffffff',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FBF8F2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              {columns.map((col) => (
                <td key={col.key} style={{ ...tdStyle, ...col.cellStyle }}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function WalletsPage() {
  const [wallets, setWallets] = useState([]);
  const [cryptoWallets, setCryptoWallets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([walletApi.getWalletList(), walletApi.getCryptoWalletList()])
      .then(([wData, cData]) => {
        setWallets(unwrapList(wData).map(normalizeFiat));
        setCryptoWallets(unwrapList(cData).map(normalizeCrypto));
      })
      .catch((err) => {
        console.error('Error loading wallets:', err);
        setWallets([]);
        setCryptoWallets([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const fiatColumns = [
    {
      key: 'name',
      label: 'Merchant Name',
      cellStyle: { fontWeight: 700, color: '#241417' },
      render: (w) => w.merchantName,
    },
    {
      key: 'id',
      label: 'Merchant ID',
      cellStyle: { fontSize: 12, fontWeight: 600, color: '#7A1F2B' },
      render: (w) => w.merchantId,
    },
    {
      key: 'balance',
      label: 'Net Balance',
      cellStyle: { fontWeight: 800, color: '#16a34a', fontSize: 14 },
      render: (w) => `₹${w.balance.toLocaleString('en-IN')}`,
    },
    {
      key: 'reserved',
      label: 'Reserved Escrow',
      cellStyle: { fontWeight: 700, color: '#C99A3D' },
      render: (w) => `₹${w.reservedBalance.toLocaleString('en-IN')}`,
    },
    {
      key: 'sync',
      label: 'Last Sync',
      cellStyle: { fontSize: 12, color: '#6b5a56', whiteSpace: 'nowrap' },
      render: (w) => w.lastUpdated,
    },
  ];

  const cryptoColumns = [
    {
      key: 'id',
      label: 'Merchant ID',
      cellStyle: { fontWeight: 700, color: '#7A1F2B' },
      render: (cw) => cw.merchantId,
    },
    {
      key: 'coin',
      label: 'Coin & Chain',
      cellStyle: { fontWeight: 700, color: '#C99A3D' },
      render: (cw) => `${cw.coinType} (${cw.chainType})`,
    },
    {
      key: 'address',
      label: 'Wallet Address',
      cellStyle: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12, color: '#6b5a56' },
      render: (cw) => cw.walletAddress,
    },
    {
      key: 'balance',
      label: 'Crypto Balance',
      cellStyle: { fontWeight: 800, color: '#241417' },
      render: (cw) => `${cw.balance} ${cw.coinType}`,
    },
    {
      key: 'usd',
      label: 'Fiat Equivalent (USD)',
      cellStyle: { fontWeight: 800, color: '#16a34a' },
      render: (cw) => `$${cw.fiatValueUSD.toLocaleString()}`,
    },
  ];

  return (
    <PayVangLayout title="Wallets & Escrow" subtitle="Central merchant escrow balances, reserve holds & crypto wallets.">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={cardStyle}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <Wallet style={{ width: 20, height: 20, color: '#7A1F2B', flexShrink: 0 }} />
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
                  Merchant Fiat Escrow Balances
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b5a56' }}>
                  Available settlement balances and reserved escrow holds
                </p>
              </div>
            </div>
            <button
              onClick={() => alert('Manually crediting wallet balance...')}
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
              <span>Credit Merchant Wallet</span>
            </button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
              <RefreshCw className="w-7 h-7 text-[#7A1F2B] animate-spin" />
            </div>
          ) : wallets.length === 0 ? (
            <EmptyState
              icon={<Wallet className="w-10 h-10 text-[#9E8984] mx-auto" />}
              title="No Data Found"
              message="No fiat escrow wallets are available yet. Credit a merchant wallet to get started."
            />
          ) : (
            <DataTable columns={fiatColumns} rows={wallets} rowKey={(w, i) => `${w.merchantId}-${i}`} />
          )}
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <Coins style={{ width: 20, height: 20, color: '#7A1F2B', flexShrink: 0 }} />
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
                Merchant Crypto Hot Wallets
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b5a56' }}>
                On-chain balances, networks and USD equivalents
              </p>
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
              <RefreshCw className="w-7 h-7 text-[#7A1F2B] animate-spin" />
            </div>
          ) : cryptoWallets.length === 0 ? (
            <EmptyState
              icon={<Coins className="w-10 h-10 text-[#9E8984] mx-auto" />}
              title="No Data Found"
              message="No crypto hot wallets are available yet."
            />
          ) : (
            <DataTable
              columns={cryptoColumns}
              rows={cryptoWallets}
              rowKey={(cw, i) => `${cw.merchantId}-${cw.coinType}-${i}`}
            />
          )}
        </div>
      </div>
    </PayVangLayout>
  );
}
