import React, { useEffect, useState } from 'react';
import PayVangLayout from '../components/layout/PayVangLayout';
import StatCard from '../components/common/StatCard';
import ProgressBar from '../components/common/ProgressBar';
import GradientButton from '../components/common/GradientButton';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid
} from 'recharts';
import {
  Users,
  Building,
  Share2,
  Briefcase,
  TrendingUp,
  RefreshCw,
  Clock,
  Wallet,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetch('/api/stats/dashboard')
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching dashboard stats:', err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <PayVangLayout title="Dashboard" subtitle="Loading payment analytics...">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <RefreshCw className="w-8 h-8 text-[#7A1F2B] animate-spin" />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#6b5a56' }}>Syncing gateway ledgers...</span>
          </div>
        </div>
      </PayVangLayout>
    );
  }

  const DONUT_COLORS = ['#7A1F2B', '#C99A3D', '#D97706'];

  return (
    <PayVangLayout title="Dashboard" subtitle="Overview of daily volume, payout settlements, and gateway velocity.">
      {/* 1. WELCOME CARD */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FBF3E7 0%, #F5E8D8 50%, #FAF2E8 100%)',
          padding: '28px 32px',
          borderRadius: '24px',
          border: '1px solid rgba(122, 31, 43, 0.15)',
          boxShadow: '0 4px 20px rgba(122, 31, 43, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '24px',
          marginBottom: '28px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #7A1F2B 0%, #C99A3D 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '22px',
              boxShadow: '0 6px 16px rgba(122,31,43,0.2)',
              flexShrink: 0
            }}
          >
            AM
          </div>
          <div>
            <div style={{ marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.06em', backgroundColor: 'rgba(122,31,43,0.1)', padding: '4px 12px', borderRadius: '9999px', border: '1px solid rgba(122,31,43,0.2)' }}>
                ADMINISTRATION PORTAL
              </span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#7A1F2B', fontFamily: "'Space Grotesk', sans-serif", margin: '4px 0 2px 0', letterSpacing: '-0.01em' }}>
              Welcome Back, Admin!
            </h2>
            <p style={{ fontSize: '13px', color: '#6b5a56', fontWeight: 500, margin: 0 }}>
              Signed in as <strong style={{ color: '#241417' }}>admin@courseraeducation.com</strong> — All acquiring channels operating cleanly.
            </p>
          </div>
        </div>

        <div style={{ flexShrink: 0 }}>
          <GradientButton onClick={() => window.location.href = '/home/payin/transactions'}>
            View Live Txns
          </GradientButton>
        </div>
      </div>

      {/* 2. STAT CARDS ROW (3 Sparklines) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        <StatCard
          title="Today's Txn Amount"
          value={`₹${data.todayTxnAmount.toLocaleString('en-IN')}`}
          badgeText="+14.2% vs yesterday"
          badgeType="green"
          sparklineData={data.todayTxnAmountSparkline}
          subtext="Processed across UPI, Cards & Netbanking"
        />
        <StatCard
          title="Today's Txn Count"
          value={data.todayTxnCount.toLocaleString('en-IN')}
          badgeText="+8.5% volume"
          badgeType="gold"
          sparklineData={data.todayTxnCountSparkline}
          subtext="Successful gateway checkout sessions"
        />
        <StatCard
          title="Txn Fees Collected"
          value={`₹${data.txnFees.toLocaleString('en-IN')}`}
          badgeText="2.0% MDR Avg"
          badgeType="maroon"
          sparklineData={data.txnFeesSparkline}
          subtext="Gross payment aggregation commission"
        />
      </div>

      {/* 3. COUNTER ROW (Sub Admins, Merchants, Resellers, Sub Merchants) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '20px 24px', borderRadius: '20px', border: '1px solid rgba(122,31,43,0.12)', boxShadow: '0 4px 16px rgba(122,31,43,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#9E8984', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sub Admins</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#7A1F2B', fontFamily: "'Space Grotesk', sans-serif", marginTop: '2px' }}>{data.subAdmins}</div>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: 'rgba(122,31,43,0.1)', color: '#7A1F2B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '20px 24px', borderRadius: '20px', border: '1px solid rgba(122,31,43,0.12)', boxShadow: '0 4px 16px rgba(122,31,43,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#9E8984', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Merchants</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#7A1F2B', fontFamily: "'Space Grotesk', sans-serif", marginTop: '2px' }}>{data.merchantsCount}</div>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: 'rgba(201,154,61,0.2)', color: '#926A18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Building className="w-6 h-6" />
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '20px 24px', borderRadius: '20px', border: '1px solid rgba(122,31,43,0.12)', boxShadow: '0 4px 16px rgba(122,31,43,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#9E8984', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Resellers</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#7A1F2B', fontFamily: "'Space Grotesk', sans-serif", marginTop: '2px' }}>{data.resellersCount}</div>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: 'rgba(22,163,74,0.1)', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Share2 className="w-6 h-6" />
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '20px 24px', borderRadius: '20px', border: '1px solid rgba(122,31,43,0.12)', boxShadow: '0 4px 16px rgba(122,31,43,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#9E8984', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sub Merchants</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#7A1F2B', fontFamily: "'Space Grotesk', sans-serif", marginTop: '2px' }}>{data.subMerchantsCount}</div>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: 'rgba(122,31,43,0.1)', color: '#7A1F2B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Briefcase className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 4. MAIN CHARTS GRID: WEEKLY PAYOUT ANALYSIS & TOTAL TXNS DONUT */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* Weekly Payout Analysis Line Chart */}
        <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '24px', border: '1px solid rgba(122,31,43,0.12)', boxShadow: '0 4px 20px rgba(122,31,43,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px', gridColumn: 'span 2 / span 2' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#7A1F2B', fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}>Weekly Payout Analysis</h3>
              <p style={{ fontSize: '12px', color: '#6b5a56', margin: '4px 0 0 0' }}>Success vs Refund vs Total volume (₹ Lakhs) from 30 Jul to 06 Aug</p>
            </div>
            <span style={{ backgroundColor: 'rgba(201, 154, 61, 0.15)', color: '#926A18', border: '1px solid rgba(201, 154, 61, 0.3)', borderRadius: '9999px', padding: '4px 12px', fontSize: '12px', fontWeight: 600 }}>30 Jul - 06 Aug</span>
          </div>

          <div style={{ height: '320px', width: '100%', paddingTop: '8px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.weeklyPayoutAnalysis} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#7A1F2B" strokeOpacity={0.08} />
                <XAxis dataKey="date" stroke="#6b5a56" fontSize={11} tickLine={false} />
                <YAxis stroke="#6b5a56" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v}L`} width={50} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FBF3E7', borderRadius: '12px', border: '1px solid rgba(122,31,43,0.2)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  formatter={(val) => [`₹${val} Lakhs`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                <Line type="monotone" dataKey="total" name="Total Volume" stroke="#241417" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="success" name="Success Payout" stroke="#7A1F2B" strokeWidth={3.5} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="refund" name="Refund Volume" stroke="#C99A3D" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Total TXNs Split Donut Chart */}
        <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '24px', border: '1px solid rgba(122,31,43,0.12)', boxShadow: '0 4px 20px rgba(122,31,43,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#7A1F2B', fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}>Total TXNs Split</h3>
            <p style={{ fontSize: '12px', color: '#6b5a56', margin: '4px 0 0 0' }}>Realtime status breakdown</p>
          </div>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '8px 0' }}>
            <div style={{ height: '180px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.totalTxnsDonut}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {data.totalTxnsDonut.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FBF3E7', borderRadius: '10px', border: '1px solid rgba(122,31,43,0.2)' }}
                    formatter={(val) => [`₹${(val / 100000).toFixed(1)} Lakhs`, 'Amount']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <span style={{ fontSize: '11px', color: '#9E8984', fontWeight: 500 }}>Gross</span>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#7A1F2B', fontFamily: "'Space Grotesk', sans-serif" }}>₹4.29 Cr</span>
              </div>
            </div>
          </div>

          {/* Donut Legend */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center', fontSize: '12px' }}>
            {data.totalTxnsDonut.map((item, idx) => (
              <div key={idx} style={{ backgroundColor: '#FAF2E8', padding: '10px 6px', borderRadius: '12px', border: '1px solid rgba(122,31,43,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color, display: 'inline-block' }}></span>
                  <span style={{ fontWeight: 600, color: '#6b5a56' }}>{item.name}</span>
                </div>
                <div style={{ fontWeight: 800, color: '#241417', marginTop: '4px' }}>{item.percentage}</div>
              </div>
            ))}
          </div>

          {/* Settlements Mini Panel */}
          <div style={{ backgroundColor: '#FBF3E7', padding: '16px', borderRadius: '16px', border: '1px solid rgba(122,31,43,0.15)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800, color: '#7A1F2B' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck style={{ width: '16px', height: '16px', color: '#C99A3D' }} />
                SETTLEMENTS MINI PANEL
              </span>
              <span style={{ backgroundColor: 'rgba(122, 31, 43, 0.1)', color: '#7A1F2B', border: '1px solid rgba(122, 31, 43, 0.2)', borderRadius: '9999px', padding: '2px 8px', fontSize: '10px', fontWeight: 700 }}>BATCH QUEUED</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '12px', color: '#6b5a56' }}>Amount Payable:</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#241417', fontFamily: "'Space Grotesk', sans-serif" }}>₹{(data.settlementsMini.amountPayable / 100000).toFixed(2)} Lakhs</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', paddingTop: '6px', borderTop: '1px solid rgba(122,31,43,0.1)' }}>
              <div>Success Txns: <strong style={{ color: '#16a34a' }}>{data.settlementsMini.successTxns.toLocaleString()}</strong></div>
              <div>Pending Txns: <strong style={{ color: '#D97706' }}>{data.settlementsMini.pendingTxns.toLocaleString()}</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. SECOND ROW: REFUNDS MINI & PENDING OVERVIEW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* Refunds Mini Chart Panel */}
        <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '24px', border: '1px solid rgba(122,31,43,0.12)', boxShadow: '0 4px 20px rgba(122,31,43,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#7A1F2B', fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}>Refunds Summary</h3>
              <p style={{ fontSize: '12px', color: '#6b5a56', margin: '4px 0 0 0' }}>Total Count: <strong style={{ color: '#241417' }}>{data.refundsMini.totalCount}</strong> | Total Amount: <strong style={{ color: '#7A1F2B' }}>₹{(data.refundsMini.totalAmount / 100000).toFixed(2)} Lakhs</strong></p>
            </div>
            <span style={{ backgroundColor: 'rgba(201, 154, 61, 0.15)', color: '#926A18', border: '1px solid rgba(201, 154, 61, 0.3)', borderRadius: '9999px', padding: '4px 12px', fontSize: '12px', fontWeight: 600 }}>This Week</span>
          </div>

          <div style={{ height: '175px', width: '100%', paddingTop: '4px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.refundsMini.data} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#6b5a56" fontSize={11} />
                <YAxis stroke="#6b5a56" fontSize={11} tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`} width={52} />
                <Tooltip formatter={(val) => [`₹${(val / 100000).toFixed(2)} Lakhs`, 'Refund Amt']} />
                <Area type="monotone" dataKey="amount" stroke="#C99A3D" strokeWidth={2.5} fill="#C99A3D" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pending Overview Panel */}
        <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '24px', border: '1px solid rgba(122,31,43,0.12)', boxShadow: '0 4px 20px rgba(122,31,43,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#7A1F2B', fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}>Pending Overview</h3>
            <Clock className="w-5 h-5 text-[#D97706]" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ProgressBar label="Pending Txn Amount" percentage={65} amountText={`₹${data.pendingOverview.amount.toLocaleString('en-IN')}`} />
            <ProgressBar label="Pending Txn Fee" percentage={30} amountText={`₹${data.pendingOverview.fee.toLocaleString('en-IN')}`} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', backgroundColor: '#FBF3E7', padding: '14px 18px', borderRadius: '16px', border: '1px solid rgba(122,31,43,0.1)' }}>
            <span style={{ color: '#6b5a56', fontWeight: 500 }}>Pending Transaction Count:</span>
            <span style={{ fontWeight: 800, color: '#7A1F2B', fontSize: '14px', fontFamily: "'Space Grotesk', sans-serif" }}>{data.pendingOverview.count} Requests</span>
          </div>
        </div>
      </div>

      {/* 6. LARGE CHART: TOTAL WALLET PAYOUT AMOUNT WITH TIME CONTROLS */}
      <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '24px', border: '1px solid rgba(122,31,43,0.12)', boxShadow: '0 4px 20px rgba(122,31,43,0.04)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wallet className="w-5 h-5 text-[#7A1F2B]" />
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#7A1F2B', fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}>Total Wallet Payout Amount</h3>
            </div>
            <p style={{ fontSize: '12px', color: '#6b5a56', margin: '4px 0 0 0' }}>Aggregated merchant wallet settlements and disbursements over time.</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#FAF2E8', padding: '6px', borderRadius: '16px', border: '1px solid rgba(122,31,43,0.15)' }}>
            {['24h', '7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                style={{
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 800,
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: timeRange === range ? '#7A1F2B' : 'transparent',
                  color: timeRange === range ? '#ffffff' : '#6b5a56',
                  boxShadow: timeRange === range ? '0 2px 8px rgba(122,31,43,0.2)' : 'none'
                }}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: '320px', width: '100%', paddingTop: '8px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.totalWalletPayout} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="payoutGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7A1F2B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#7A1F2B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#7A1F2B" strokeOpacity={0.08} />
              <XAxis dataKey="date" stroke="#6b5a56" fontSize={11} tickLine={false} />
              <YAxis stroke="#6b5a56" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v}L`} width={50} />
              <Tooltip
                contentStyle={{ backgroundColor: '#FBF3E7', borderRadius: '12px', border: '1px solid rgba(122,31,43,0.2)' }}
                formatter={(val) => [`₹${val} Lakhs`, 'Payout Amount']}
              />
              <Area type="monotone" dataKey="amount" name="Payout Amount" stroke="#7A1F2B" strokeWidth={3} fillOpacity={1} fill="url(#payoutGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </PayVangLayout>
  );
}
