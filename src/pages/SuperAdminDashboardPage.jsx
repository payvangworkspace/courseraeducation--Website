import React, { useEffect, useState } from 'react';
import PayVangLayout from '../components/layout/PayVangLayout';
import StatCard from '../components/common/StatCard';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { BarChart3, RefreshCw, TrendingUp, Wallet } from 'lucide-react';
import { getSuperAdminStats } from '../api';

const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: 24,
  padding: 28,
  border: '1px solid rgba(122, 31, 43, 0.12)',
  boxShadow: '0 4px 20px rgba(122, 31, 43, 0.04)',
};

const tooltipStyle = {
  backgroundColor: '#FBF3E7',
  borderRadius: 12,
  border: '1px solid rgba(122,31,43,0.2)',
  fontSize: 12,
};

function isZeroAmount(value) {
  const n = Number(String(value || '').replace(/[₹,\s]/g, ''));
  return !Number.isFinite(n) || n === 0;
}

function ChartEmptyState({ icon, title, message }) {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 220,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundColor: '#FAF2E8',
        borderRadius: 16,
        border: '1px solid rgba(122, 31, 43, 0.1)',
        padding: 32,
      }}
    >
      {icon}
      <h4 style={{ fontSize: 15, fontWeight: 800, color: '#7A1F2B', margin: '12px 0 4px' }}>{title}</h4>
      <p style={{ fontSize: 12, color: '#6b5a56', margin: 0, maxWidth: 280 }}>{message}</p>
    </div>
  );
}

export default function SuperAdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSuperAdminStats()
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading super admin data:', err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <PayVangLayout title="Super-Admin Dashboard" subtitle="Loading executive metrics...">
        <div
          style={{
            ...cardStyle,
            minHeight: 320,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <RefreshCw className="w-8 h-8 text-[#7A1F2B] animate-spin" />
        </div>
      </PayVangLayout>
    );
  }

  const PROFIT_COLORS = ['#7A1F2B', '#C99A3D', '#16a34a'];
  const weeklyHasData = (data.weeklyAnalysis || []).some((d) => Number(d.payin) > 0 || Number(d.payout) > 0);
  const profitsHasData = (data.profitsDonut || []).some((d) => Number(d.value) > 0);
  const monthlyHasData = (data.monthlyRevenueTrend || []).some(
    (d) => Number(d.revenue) > 0 || Number(d.growth) !== 0
  );

  return (
    <PayVangLayout
      title="Super-Admin Dashboard"
      subtitle="Executive oversight: aggregated payin volumes, payouts, platform margins & profitability."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          <StatCard
            title="Aggregated Payin"
            value={data.payin.amount}
            badgeText={isZeroAmount(data.payin.amount) ? 'No activity' : '+18.4% YTD'}
            badgeType={isZeroAmount(data.payin.amount) ? 'gold' : 'maroon'}
            sparklineData={data.payin.sparkline}
            subtext="Total inbound acquiring gross volume"
          />
          <StatCard
            title="Aggregated Payout"
            value={data.payout.amount}
            badgeText={isZeroAmount(data.payout.amount) ? 'No activity' : '+12.1% YTD'}
            badgeType="gold"
            sparklineData={data.payout.sparkline}
            subtext="Merchant wallet disbursements"
          />
          <StatCard
            title="Net Platform Wallet"
            value={data.wallet.amount}
            badgeText={isZeroAmount(data.wallet.amount) ? 'No activity' : 'Reserve Ratio 21%'}
            badgeType="green"
            sparklineData={data.wallet.sparkline}
            subtext="Central escrow & settlement reserve balance"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div style={{ ...cardStyle, gridColumn: 'span 1', minWidth: 0 }} className="lg:col-span-2">
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 12,
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
                  Weekly Analysis (Payin vs Payout)
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#6b5a56' }}>
                  Last 7 days volume comparison in ₹ Crores
                </p>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#7A1F2B',
                  backgroundColor: 'rgba(122, 31, 43, 0.08)',
                  border: '1px solid rgba(122, 31, 43, 0.15)',
                  padding: '6px 12px',
                  borderRadius: 999,
                  whiteSpace: 'nowrap',
                }}
              >
                Last 7 days
              </span>
            </div>

            {weeklyHasData ? (
              <div style={{ height: 280, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.weeklyAnalysis} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#7A1F2B" strokeOpacity={0.08} vertical={false} />
                    <XAxis dataKey="day" stroke="#6b5a56" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#6b5a56" fontSize={12} unit="Cr" tickLine={false} axisLine={false} width={48} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(val, name) => [`₹${val} Cr`, name]} />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                    <Bar dataKey="payin" name="Payin Volume" fill="#7A1F2B" radius={[6, 6, 0, 0]} maxBarSize={28} />
                    <Bar dataKey="payout" name="Payout Volume" fill="#C99A3D" radius={[6, 6, 0, 0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <ChartEmptyState
                icon={<BarChart3 className="w-10 h-10 text-[#9E8984]" />}
                title="No Data Found"
                message="Payin and payout volume for the last 7 days will appear here once transactions are recorded."
              />
            )}
          </div>

          <div style={{ ...cardStyle, minWidth: 0, maxWidth: '100%' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 12,
                marginBottom: 16,
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
                  Platform Profits
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#6b5a56' }}>Net commission mix</p>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#9E8984', whiteSpace: 'nowrap' }}>
                {data.profitCenterTotal}
              </span>
            </div>

            {profitsHasData ? (
              <>
                <div style={{ height: 200, width: '100%', position: 'relative' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.profitsDonut}
                        cx="50%"
                        cy="50%"
                        innerRadius={58}
                        outerRadius={78}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {data.profitsDonut.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PROFIT_COLORS[index % PROFIT_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} formatter={(val) => [`${val}%`, 'Profit split']} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none',
                      textAlign: 'center',
                    }}
                  >
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#9E8984', textTransform: 'uppercase' }}>
                      Total net profit
                    </span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#7A1F2B' }}>{data.profitCenterTotal}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                  {data.profitsDonut.map((item, idx) => (
                    <div
                      key={item.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: 12,
                        backgroundColor: '#FBF3E7',
                        fontSize: 12,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            backgroundColor: item.color || PROFIT_COLORS[idx],
                          }}
                        />
                        <span style={{ fontWeight: 600, color: '#6b5a56' }}>{item.name}</span>
                      </div>
                      <span style={{ fontWeight: 800, color: '#241417' }}>{item.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <ChartEmptyState
                icon={<Wallet className="w-10 h-10 text-[#9E8984]" />}
                title="No Data Found"
                message="Commission and profit split will show here after successful transactions are processed."
              />
            )}
          </div>
        </div>

        <div style={cardStyle}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 12,
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
                Monthly Revenue Trend & Growth
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#6b5a56' }}>
                Trailing 7-month revenue accretion and month-over-month growth rate
              </p>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: '#926A18',
                backgroundColor: 'rgba(201, 154, 61, 0.15)',
                border: '1px solid rgba(201, 154, 61, 0.3)',
                padding: '6px 12px',
                borderRadius: 999,
                whiteSpace: 'nowrap',
              }}
            >
              Last 7 months
            </span>
          </div>

          {monthlyHasData ? (
            <div style={{ height: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.monthlyRevenueTrend} margin={{ top: 12, right: 24, left: 4, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#7A1F2B" strokeOpacity={0.08} />
                  <XAxis
                    dataKey="month"
                    stroke="#6b5a56"
                    fontSize={12}
                    interval={0}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="#6b5a56"
                    fontSize={12}
                    unit="Cr"
                    tickLine={false}
                    axisLine={false}
                    width={48}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#16a34a"
                    fontSize={12}
                    unit="%"
                    tickLine={false}
                    axisLine={false}
                    width={44}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(val, name) => [
                      name === 'revenue' ? `₹${val} Cr` : `${val}%`,
                      name === 'revenue' ? 'Monthly revenue' : 'MoM growth',
                    ]}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue (₹ Cr)"
                    stroke="#7A1F2B"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#7A1F2B' }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="growth"
                    name="Growth Rate (%)"
                    stroke="#16a34a"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 3, fill: '#16a34a' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <ChartEmptyState
              icon={<TrendingUp className="w-10 h-10 text-[#9E8984]" />}
              title="No Data Found"
              message="Monthly revenue and growth will appear here once there is transaction history across months."
            />
          )}
        </div>
      </div>
    </PayVangLayout>
  );
}
