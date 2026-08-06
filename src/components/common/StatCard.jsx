import React from 'react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function StatCard({ title, value, badgeText, badgeType = 'gold', sparklineData, subtext }) {
  const getBadgeStyle = () => {
    switch (badgeType) {
      case 'green':
        return { backgroundColor: 'rgba(22, 163, 74, 0.1)', color: '#15803d', border: '1px solid rgba(22, 163, 74, 0.25)' };
      case 'red':
        return { backgroundColor: 'rgba(220, 38, 38, 0.1)', color: '#b91c1c', border: '1px solid rgba(220, 38, 38, 0.25)' };
      case 'maroon':
        return { backgroundColor: 'rgba(122, 31, 43, 0.1)', color: '#7A1F2B', border: '1px solid rgba(122, 31, 43, 0.25)' };
      case 'gold':
      default:
        return { backgroundColor: 'rgba(201, 154, 61, 0.15)', color: '#926A18', border: '1px solid rgba(201, 154, 61, 0.3)' };
    }
  };

  const chartData = sparklineData ? sparklineData.map((val, i) => ({ i, val })) : null;
  const safeId = title ? title.replace(/[^a-zA-Z0-9]/g, '') : 'sparkline';

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid rgba(122, 31, 43, 0.12)',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 4px 16px rgba(122, 31, 43, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#6b5a56', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {title}
          </span>
          {badgeText && (
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: '9999px',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                ...getBadgeStyle()
              }}
            >
              {badgeText}
            </span>
          )}
        </div>

        <div style={{ fontSize: '30px', fontWeight: 800, color: '#7A1F2B', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em', marginBottom: '4px' }}>
          {value}
        </div>

        {subtext && (
          <p style={{ fontSize: '12px', color: '#9E8984', fontWeight: 500, margin: 0 }}>
            {subtext}
          </p>
        )}
      </div>

      {chartData && (
        <div style={{ height: '56px', width: '100%', marginTop: '16px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 6, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`grad-${safeId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7A1F2B" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#C99A3D" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="val"
                stroke="#7A1F2B"
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#grad-${safeId})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
