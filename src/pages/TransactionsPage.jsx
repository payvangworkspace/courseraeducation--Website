import React, { useEffect, useState } from 'react';
import PayVangLayout from '../components/layout/PayVangLayout';
import StatCard from '../components/common/StatCard';
import { CreditCard, Download, Filter, RefreshCw, Eye, X } from 'lucide-react';
import { merchantApi, paymentApi, unwrapList } from '../api';

function toNumber(value) {
  if (value === null || value === undefined || value === '') return 0;
  const n = Number(String(value).replace(/[₹,\s]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function normalizeStatus(raw) {
  const s = String(raw || '').toLowerCase();
  if (['success', 'successful', 'captured', 'paid', 'completed', 'settled'].includes(s)) return 'Success';
  if (['failed', 'fail', 'declined', 'error'].includes(s)) return 'Failed';
  return 'Pending';
}

function normalizeTxn(t) {
  return {
    id: t.txnId || t.transactionId || t.orderId || t.id || '—',
    merchantId: t.merchantId || t.userId || '—',
    merchantName: t.merchantName || t.fullName || t.businessName || '—',
    status: normalizeStatus(t.status || t.txnStatus),
    customerName: t.customerName || t.name || '—',
    customerEmail: t.customerEmail || t.email || '—',
    txnAmt: toNumber(t.txnAmt ?? t.amount ?? t.txnAmount ?? t.totalAmount),
    currency: t.currency || t.currencyCode || 'INR',
    transactionType: t.transactionType || t.txnType || t.type || 'PAYIN',
    createdOn: t.createdOn || t.createdDate || t.date || t.txnDate || '—',
    raw: t,
  };
}

function buildStats(items) {
  const bucket = () => ({ count: 0, amount: 0 });
  const stats = { total: bucket(), success: bucket(), failed: bucket(), pending: bucket() };
  items.forEach((item) => {
    stats.total.count += 1;
    stats.total.amount += item.txnAmt;
    const key = item.status === 'Success' ? 'success' : item.status === 'Failed' ? 'failed' : 'pending';
    stats[key].count += 1;
    stats[key].amount += item.txnAmt;
  });
  return stats;
}

export default function TransactionsPage() {
  const [data, setData] = useState({ stats: null, items: [] });
  const [loading, setLoading] = useState(true);
  const [merchantsList, setMerchantsList] = useState([]);
  const [selectedTxnDetail, setSelectedTxnDetail] = useState(null);

  // Filters state
  const [merchant, setMerchant] = useState('ALL');
  const [currency, setCurrency] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Fetch Merchants for Filter
  useEffect(() => {
    merchantApi
      .getAllMerchantList({ start: 0, size: "25", keyword: "" })
      .then((res) => {
        setMerchantsList(
          unwrapList(res).map((m) => ({
            id: m.userId || m.id || m.merchantId,
            name: m.fullName || m.name || m.businessName || m.userId || m.id,
          }))
        );
      })
      .catch((err) => console.error(err));
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await paymentApi.getAllTransactions({});

      let items = unwrapList(res).map(normalizeTxn);

      if (merchant !== 'ALL') items = items.filter((t) => String(t.merchantId) === String(merchant));
      if (currency !== 'ALL') items = items.filter((t) => String(t.currency).toUpperCase() === currency);
      if (status !== 'ALL') items = items.filter((t) => t.status === status);
      if (dateFrom) {
        const from = new Date(dateFrom);
        items = items.filter((t) => {
          const d = new Date(t.createdOn);
          return Number.isNaN(d.getTime()) || d >= from;
        });
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        items = items.filter((t) => {
          const d = new Date(t.createdOn);
          return Number.isNaN(d.getTime()) || d <= to;
        });
      }

      setData({ stats: buildStats(items), items });
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setData({ stats: buildStats([]), items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [merchant, currency, status, dateFrom, dateTo]);

  // Export to CSV Function
  const exportToCSV = () => {
    if (!data.items || data.items.length === 0) {
      alert('No transaction records available to export.');
      return;
    }
    const headers = ['Txn ID', 'Merchant ID', 'Merchant Name', 'Status', 'Customer Name', 'Customer Email', 'Amount', 'Currency', 'Type', 'Created On'];
    const csvRows = [headers.join(',')];
    data.items.forEach((item) => {
      csvRows.push([
        item.id,
        item.merchantId,
        `"${item.merchantName}"`,
        item.status,
        `"${item.customerName}"`,
        item.customerEmail,
        item.txnAmt,
        item.currency,
        item.transactionType,
        `"${item.createdOn}"`
      ].join(','));
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PayVang_Transactions_Export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Success':
        return 'coursera-badge-green';
      case 'Failed':
        return 'coursera-badge-red';
      case 'Pending':
      default:
        return 'coursera-badge-gold';
    }
  };

  const fieldStyle = {
    width: '100%',
    height: 42,
    backgroundColor: '#FAF2E8',
    border: '1px solid rgba(122, 31, 43, 0.15)',
    color: '#241417',
    fontSize: 13,
    fontWeight: 500,
    borderRadius: 12,
    padding: '0 14px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 11.5,
    fontWeight: 800,
    color: '#7A1F2B',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 8,
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 28,
    border: '1px solid rgba(122, 31, 43, 0.12)',
    boxShadow: '0 4px 20px rgba(122, 31, 43, 0.04)',
  };

  const thStyle = {
    padding: '14px 16px',
    fontWeight: 800,
    fontSize: 11.5,
    color: '#7A1F2B',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
  };

  const tdStyle = {
    padding: '14px 16px',
    verticalAlign: 'middle',
  };

  return (
    <PayVangLayout title="Payin - Transactions" subtitle="Live acquiring payment ledger, customer checkout sessions & audit trail.">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Filter style={{ width: 16, height: 16, color: '#C99A3D' }} />
            <h3
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 800,
                color: '#7A1F2B',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Payin Ledger Filters
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: 16,
            }}
          >
            <div>
              <label style={labelStyle}>Merchant</label>
              <select value={merchant} onChange={(e) => setMerchant(e.target.value)} style={fieldStyle}>
                <option value="ALL">All Merchants</option>
                {merchantsList.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={fieldStyle}>
                <option value="ALL">All Currencies</option>
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Date From</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={fieldStyle} />
            </div>
            <div>
              <label style={labelStyle}>Date To</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={fieldStyle} />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} style={fieldStyle}>
                <option value="ALL">All Statuses</option>
                <option value="Success">Success</option>
                <option value="Failed">Failed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {data.stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <StatCard
              title="Total Transactions"
              value={data.stats.total.count}
              badgeText={`₹${data.stats.total.amount.toLocaleString('en-IN')}`}
              badgeType="maroon"
              subtext="Gross acquiring volume"
            />
            <StatCard
              title="Success Txns"
              value={data.stats.success.count}
              badgeText={`₹${data.stats.success.amount.toLocaleString('en-IN')}`}
              badgeType="green"
              subtext="Captured & settled"
            />
            <StatCard
              title="Failed Txns"
              value={data.stats.failed.count}
              badgeText={`₹${data.stats.failed.amount.toLocaleString('en-IN')}`}
              badgeType="red"
              subtext="Declined or errored"
            />
            <StatCard
              title="Pending Txns"
              value={data.stats.pending.count}
              badgeText={`₹${data.stats.pending.amount.toLocaleString('en-IN')}`}
              badgeType="gold"
              subtext="Awaiting confirmation"
            />
          </div>
        )}

        <div style={cardStyle}>
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
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 800,
                  color: '#7A1F2B',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Acquiring Transaction Records
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b5a56' }}>
                Checkout sessions, amounts and settlement status
              </p>
            </div>
            <button
              onClick={exportToCSV}
              disabled={loading || data.items.length === 0}
              style={{
                height: 40,
                padding: '0 16px',
                borderRadius: 9999,
                backgroundColor: '#FAF2E8',
                color: '#7A1F2B',
                fontWeight: 700,
                fontSize: 12,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                border: '1px solid rgba(122, 31, 43, 0.2)',
                cursor: loading || data.items.length === 0 ? 'not-allowed' : 'pointer',
                opacity: loading || data.items.length === 0 ? 0.55 : 1,
                flexShrink: 0,
              }}
            >
              <Download className="w-4 h-4" />
              Export to Excel
            </button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              <RefreshCw className="w-7 h-7 text-[#7A1F2B] animate-spin" />
            </div>
          ) : data.items.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 16px',
                backgroundColor: '#FAF2E8',
                borderRadius: 16,
                border: '1px solid rgba(122, 31, 43, 0.1)',
              }}
            >
              <CreditCard className="w-10 h-10 text-[#9E8984] mx-auto" />
              <h4 style={{ fontSize: 16, fontWeight: 800, color: '#7A1F2B', margin: '12px 0 4px' }}>
                No Data Found
              </h4>
              <p style={{ fontSize: 12, color: '#6b5a56', margin: 0 }}>
                No transaction logs match the selected filter criteria.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', borderRadius: 16, border: '1px solid rgba(122, 31, 43, 0.12)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#FAF2E8', borderBottom: '1px solid rgba(122, 31, 43, 0.12)' }}>
                    <th style={thStyle}>Txn ID</th>
                    <th style={thStyle}>Merchant ID</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Customer Email</th>
                    <th style={thStyle}>Txn Amt</th>
                    <th style={thStyle}>Type</th>
                    <th style={thStyle}>Created On</th>
                    <th style={thStyle}>Customer Name</th>
                    <th style={thStyle}>Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((txn, index) => (
                    <tr
                      key={txn.id}
                      style={{
                        borderBottom: index === data.items.length - 1 ? 'none' : '1px solid rgba(122, 31, 43, 0.06)',
                        backgroundColor: '#ffffff',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FBF8F2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                      }}
                    >
                      <td style={{ ...tdStyle, fontWeight: 700, color: '#7A1F2B' }}>{txn.id}</td>
                      <td style={{ ...tdStyle, fontSize: 12, color: '#6b5a56' }}>{txn.merchantId}</td>
                      <td style={tdStyle}>
                        <span className={getStatusBadge(txn.status)}>{txn.status}</span>
                      </td>
                      <td style={{ ...tdStyle, fontSize: 12, color: '#241417' }}>{txn.customerEmail}</td>
                      <td style={{ ...tdStyle, fontWeight: 800, color: '#241417' }}>
                        ₹{txn.txnAmt.toLocaleString('en-IN')}
                      </td>
                      <td style={{ ...tdStyle, fontSize: 12, fontWeight: 600, color: '#926A18' }}>{txn.transactionType}</td>
                      <td style={{ ...tdStyle, fontSize: 12, color: '#6b5a56', whiteSpace: 'nowrap' }}>{txn.createdOn}</td>
                      <td style={{ ...tdStyle, fontWeight: 600, color: '#241417' }}>{txn.customerName}</td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => setSelectedTxnDetail(txn)}
                          title="View Detail"
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 10,
                            border: 'none',
                            backgroundColor: 'rgba(122, 31, 43, 0.1)',
                            color: '#7A1F2B',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedTxnDetail && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 24,
              padding: 28,
              width: '100%',
              maxWidth: 520,
              border: '1px solid rgba(122, 31, 43, 0.12)',
              boxShadow: '0 12px 40px rgba(36, 20, 23, 0.18)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: 16,
                marginBottom: 16,
                borderBottom: '1px solid rgba(122, 31, 43, 0.12)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CreditCard className="w-5 h-5 text-[#7A1F2B]" />
                <h3
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 800,
                    color: '#7A1F2B',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  Transaction Detail
                </h3>
              </div>
              <button
                onClick={() => setSelectedTxnDetail(null)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: '#FAF2E8',
                  color: '#7A1F2B',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13 }}>
              {[
                ['Transaction ID', selectedTxnDetail.id],
                ['Merchant', `${selectedTxnDetail.merchantName} (${selectedTxnDetail.merchantId})`],
                ['Amount', `₹${selectedTxnDetail.txnAmt.toLocaleString('en-IN')} ${selectedTxnDetail.currency}`],
                ['Customer', `${selectedTxnDetail.customerName} (${selectedTxnDetail.customerEmail})`],
                ['Payment method', selectedTxnDetail.transactionType],
                ['Created on', selectedTxnDetail.createdOn],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 16,
                    paddingBottom: 12,
                    borderBottom: '1px solid rgba(122, 31, 43, 0.08)',
                  }}
                >
                  <span style={{ color: '#6b5a56' }}>{label}</span>
                  <span style={{ fontWeight: 700, color: '#241417', textAlign: 'right' }}>{value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#6b5a56', fontSize: 13 }}>Status</span>
                <span className={getStatusBadge(selectedTxnDetail.status)}>{selectedTxnDetail.status}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
              <button
                onClick={() => setSelectedTxnDetail(null)}
                style={{
                  height: 40,
                  padding: '0 20px',
                  borderRadius: 9999,
                  backgroundColor: '#7A1F2B',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: 13,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </PayVangLayout>
  );
}
