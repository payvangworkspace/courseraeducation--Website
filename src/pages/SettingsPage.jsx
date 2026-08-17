import React, { useState } from 'react';
import PayVangLayout from '../components/layout/PayVangLayout';
import GradientButton from '../components/common/GradientButton';
import { Bell, CheckCircle2, Clock, Shield, Webhook } from 'lucide-react';

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      style={{
        width: 48,
        height: 28,
        borderRadius: 999,
        border: 'none',
        padding: 3,
        cursor: 'pointer',
        flexShrink: 0,
        background: checked
          ? 'linear-gradient(135deg, #7A1F2B 0%, #C99A3D 100%)'
          : '#E8D9CC',
        boxShadow: checked ? '0 2px 8px rgba(122, 31, 43, 0.25)' : 'none',
        transition: 'background 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      <span
        style={{
          display: 'block',
          width: 22,
          height: 22,
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          transform: checked ? 'translateX(20px)' : 'translateX(0)',
          transition: 'transform 0.2s ease',
          boxShadow: '0 1px 3px rgba(36, 20, 23, 0.2)',
        }}
      />
    </button>
  );
}

function SettingRow({ icon, iconBg, iconColor, title, description, checked, onChange }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        padding: '18px 20px',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        border: '1px solid rgba(122, 31, 43, 0.1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, minWidth: 0 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: iconBg,
            color: iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#241417', lineHeight: 1.3 }}>{title}</div>
          <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#6b5a56', lineHeight: 1.45 }}>{description}</p>
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} label={title} />
    </div>
  );
}

export default function SettingsPage() {
  const [webhookUrl, setWebhookUrl] = useState('https://api.merchant.com/payvang/webhooks');
  const [enforce3ds, setEnforce3ds] = useState(true);
  const [autoSettlement, setAutoSettlement] = useState(true);
  const [saved, setSaved] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <PayVangLayout title="Settings" subtitle="Gateway parameters, security preferences & global notifications.">
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 24,
          padding: '32px',
          border: '1px solid rgba(122, 31, 43, 0.12)',
          boxShadow: '0 4px 20px rgba(122, 31, 43, 0.04)',
          maxWidth: 820,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              backgroundColor: 'rgba(122, 31, 43, 0.08)',
              color: '#7A1F2B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Bell style={{ width: 20, height: 20 }} />
          </div>
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
              Platform Configuration
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b5a56' }}>
              Manage webhook delivery, card security and settlement automation
            </p>
          </div>
        </div>

        {saved && (
          <div
            style={{
              padding: '14px 16px',
              marginBottom: 24,
              backgroundColor: 'rgba(22, 163, 74, 0.08)',
              border: '1px solid rgba(22, 163, 74, 0.28)',
              color: '#15803d',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <CheckCircle2 style={{ width: 18, height: 18, flexShrink: 0 }} />
            <span>Settings updated successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave}>
          <div
            style={{
              padding: 24,
              backgroundColor: '#FBF8F2',
              borderRadius: 18,
              border: '1px solid rgba(122, 31, 43, 0.08)',
              marginBottom: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Webhook style={{ width: 16, height: 16, color: '#C99A3D' }} />
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 800,
                  color: '#7A1F2B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Notifications
              </span>
            </div>
            <label
              htmlFor="webhook-url"
              style={{
                display: 'block',
                fontSize: 11.5,
                fontWeight: 800,
                color: '#7A1F2B',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 8,
              }}
            >
              Webhook Endpoint URL
            </label>
            <input
              id="webhook-url"
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="https://your-domain.com/webhooks"
              style={{
                width: '100%',
                height: 46,
                backgroundColor: '#ffffff',
                border: focused ? '1px solid #7A1F2B' : '1px solid rgba(122, 31, 43, 0.15)',
                boxShadow: focused ? '0 0 0 3px rgba(122, 31, 43, 0.12)' : 'none',
                color: '#241417',
                fontSize: 13.5,
                fontWeight: 500,
                borderRadius: 12,
                padding: '0 16px',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              }}
            />
            <p style={{ margin: '8px 0 0', fontSize: 12, color: '#9E8984' }}>
              Transaction events, refunds and settlement callbacks will be posted to this URL.
            </p>
          </div>

          <div
            style={{
              padding: 24,
              backgroundColor: '#FBF8F2',
              borderRadius: 18,
              border: '1px solid rgba(122, 31, 43, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Shield style={{ width: 16, height: 16, color: '#C99A3D' }} />
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 800,
                  color: '#7A1F2B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Security & Settlement
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <SettingRow
                icon={<Shield style={{ width: 18, height: 18 }} />}
                iconBg="rgba(122, 31, 43, 0.08)"
                iconColor="#7A1F2B"
                title="Enforce 3D Secure 2.2"
                description="Require OTP authentication on all debit and credit card transactions."
                checked={enforce3ds}
                onChange={setEnforce3ds}
              />
              <SettingRow
                icon={<Clock style={{ width: 18, height: 18 }} />}
                iconBg="rgba(201, 154, 61, 0.14)"
                iconColor="#C99A3D"
                title="Auto-Settlement Nightly Cron"
                description="Automatically trigger batch clearing at 23:00 IST."
                checked={autoSettlement}
                onChange={setAutoSettlement}
              />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              paddingTop: 24,
              marginTop: 8,
            }}
          >
            <GradientButton type="submit">Save Changes</GradientButton>
          </div>
        </form>
      </div>
    </PayVangLayout>
  );
}
