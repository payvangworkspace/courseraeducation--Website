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
  CartesianGrid
} from 'recharts';
import { ShieldCheck, RefreshCw, TrendingUp, DollarSign, Award, Layers } from 'lucide-react';

export default function SuperAdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats/super-admin')
      .then((res) => res.json())
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
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="w-8 h-8 text-[#7A1F2B] animate-spin" />
        </div>
      </PayVangLayout>
    );
  }

  const PROFIT_COLORS = ['#7A1F2B', '#C99A3D', '#16a34a'];

  return (
    <PayVangLayout title="Super-Admin Dashboard" subtitle="Executive oversight: aggregated payin volumes, payouts, platform margins & profitability.">
      {/* 1. 3 STAT CARDS: PAYIN, PAYOUT, WALLET WITH SPARKLINES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          title="Aggregated Payin"
          value={data.payin.amount}
          badgeText="+18.4% YTD"
          badgeType="maroon"
          sparklineData={data.payin.sparkline}
          subtext="Total inbound acquiring gross volume"
        />
        <StatCard
          title="Aggregated Payout"
          value={data.payout.amount}
          badgeText="+12.1% YTD"
          badgeType="gold"
          sparklineData={data.payout.sparkline}
          subtext="Merchant wallet disbursements"
        />
        <StatCard
          title="Net Platform Wallet"
          value={data.wallet.amount}
          badgeText="Reserve Ratio 21%"
          badgeType="green"
          sparklineData={data.wallet.sparkline}
          subtext="Central Escrow & Settlement reserve balance"
        />
      </div>

      {/* 2. WEEKLY ANALYSIS BAR CHART & PROFITS DONUT CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Analysis Bar Chart (2 Cols) */}
        <div className="coursera-card p-6 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-[#7A1F2B] font-heading">Weekly Analysis (Payin vs Payout)</h3>
              <p className="text-xs text-[#6b5a56]">Mon-Sat Volume comparison in ₹ Crores</p>
            </div>
            <span className="coursera-badge-maroon text-xs">Mon - Sat</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.weeklyAnalysis} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#7A1F2B" strokeOpacity={0.08} />
                <XAxis dataKey="day" stroke="#6b5a56" fontSize={12} />
                <YAxis stroke="#6b5a56" fontSize={12} unit="Cr" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FBF3E7', borderRadius: '12px', border: '1px solid rgba(122,31,43,0.2)' }}
                  formatter={(val) => [`₹${val} Cr`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="payin" name="Payin Volume" fill="#7A1F2B" radius={[6, 6, 0, 0]} />
                <Bar dataKey="payout" name="Payout Volume" fill="#C99A3D" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profits Donut Chart (1 Col) */}
        <div className="coursera-card p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-[#7A1F2B] font-heading">Platform Profits</h3>
              <span className="text-xs text-[#9E8984]">Net Commission</span>
            </div>

            <div className="h-48 w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.profitsDonut}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {data.profitsDonut.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PROFIT_COLORS[index % PROFIT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FBF3E7', borderRadius: '10px', border: '1px solid rgba(122,31,43,0.2)' }}
                    formatter={(val) => [`${val}%`, 'Profit Split']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[10px] text-[#9E8984] font-semibold uppercase">Total Net Profit</span>
                <span className="text-base font-extrabold text-[#7A1F2B]">{data.profitCenterTotal}</span>
              </div>
            </div>

            {/* Profits Breakdown */}
            <div className="space-y-2 pt-2">
              {data.profitsDonut.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#FBF3E7]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="font-semibold text-[#6b5a56]">{item.name}</span>
                  </div>
                  <span className="font-extrabold text-[#241417]">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. MONTHLY ANALYSIS SECTION (Revenue Trend & Yearly Growth) */}
      <div className="coursera-card p-6 lg:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-[#7A1F2B] font-heading">Monthly Revenue Trend & Growth</h3>
            <p className="text-xs text-[#6b5a56]">Trailing 7-month revenue accretion & year-over-year expansion rate (%)</p>
          </div>
          <span className="coursera-badge-gold text-xs font-semibold">FY 2026-27</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.monthlyRevenueTrend} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#7A1F2B" strokeOpacity={0.08} />
              <XAxis dataKey="month" stroke="#6b5a56" fontSize={12} />
              <YAxis stroke="#6b5a56" fontSize={12} unit="Cr" />
              <Tooltip
                contentStyle={{ backgroundColor: '#FBF3E7', borderRadius: '12px', border: '1px solid rgba(122,31,43,0.2)' }}
                formatter={(val, name) => [name === 'revenue' ? `₹${val} Cr` : `${val}%`, name === 'revenue' ? 'Monthly Revenue' : 'YoY Growth Rate']}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="revenue" name="Revenue (₹ Cr)" stroke="#7A1F2B" strokeWidth={3} activeDot={{ r: 7 }} />
              <Line type="monotone" dataKey="growth" name="Growth Rate (%)" stroke="#16a34a" strokeWidth={2} strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </PayVangLayout>
  );
}
