import React, { useState } from 'react';
import PayVangLayout from '../components/layout/PayVangLayout';
import { Copy, Check, Terminal, Key, ShieldAlert } from 'lucide-react';

const SAMPLE_RESPONSE = {
  status: 'success',
  code: 'PAYMENT_INITIATED',
  transaction_id: 'TXN-90124',
  amount: 4999.0,
  currency: 'INR',
  gateway_redirect_url: 'https://payvang.com/pay/session/90124',
};

export default function ApiDocsPage() {
  const [copiedSection, setCopiedSection] = useState(null);

  const copyCode = (code, section) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const apiKey = 'pvk_live_998127391823';
  const curlSnippet = `curl -X POST https://api.payvang.com/v1/charge \\
  -H "X-PayVang-Key: ${apiKey}" \\
  -H "X-PayVang-Secret: pvs_secret_3389102" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 4999.00,
    "currency": "INR",
    "customer": {
      "name": "Rahul Sharma",
      "email": "rahul.sharma@gmail.com",
      "phone": "+919820011223"
    },
    "payment_method": "UPI",
    "callback_url": "https://yourdomain.com/payvang/callback"
  }'`;

  const responseJson = JSON.stringify(SAMPLE_RESPONSE, null, 2);

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 28,
    border: '1px solid rgba(122, 31, 43, 0.12)',
    boxShadow: '0 4px 20px rgba(122, 31, 43, 0.04)',
  };

  const CopyButton = ({ section, value, label }) => (
    <button
      type="button"
      onClick={() => copyCode(value, section)}
      style={{
        height: 34,
        padding: '0 12px',
        borderRadius: 10,
        border: '1px solid rgba(122, 31, 43, 0.15)',
        backgroundColor: copiedSection === section ? 'rgba(22, 163, 74, 0.12)' : '#FAF2E8',
        color: copiedSection === section ? '#15803d' : '#7A1F2B',
        fontWeight: 700,
        fontSize: 11.5,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      {copiedSection === section ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copiedSection === section ? 'Copied' : label}
    </button>
  );

  return (
    <PayVangLayout title="API Documentation" subtitle="Developer API references, SDK integration guidelines & authentication headers.">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={cardStyle}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, minWidth: 0 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  backgroundColor: 'rgba(122, 31, 43, 0.08)',
                  color: '#7A1F2B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Key style={{ width: 20, height: 20 }} />
              </div>
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
                  Live Production API Keys
                </h3>
                <p style={{ margin: '6px 0 0', fontSize: 13, color: '#6b5a56', maxWidth: 460, lineHeight: 1.45 }}>
                  Keep secret keys server-side only. Never expose them in client-side or mobile apps.
                </p>
              </div>
            </div>
            <CopyButton section="key" value={apiKey} label="Copy key" />
          </div>

          <div
            style={{
              marginTop: 20,
              padding: '14px 16px',
              backgroundColor: '#FBF8F2',
              borderRadius: 14,
              border: '1px solid rgba(122, 31, 43, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <code style={{ fontSize: 13, color: '#241417', wordBreak: 'break-all' }}>
              <span style={{ color: '#9E8984', fontWeight: 600 }}>X-PayVang-Key:</span>{' '}
              <span style={{ fontWeight: 700, color: '#7A1F2B' }}>{apiKey}</span>
            </code>
          </div>

          <div
            style={{
              marginTop: 12,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              color: '#926A18',
              fontSize: 12,
            }}
          >
            <ShieldAlert style={{ width: 14, height: 14, marginTop: 1, flexShrink: 0 }} />
            <span>Rotate keys immediately if they appear in logs, tickets, or public repositories.</span>
          </div>
        </div>

        <div style={cardStyle}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              marginBottom: 16,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Terminal style={{ width: 18, height: 18, color: '#7A1F2B' }} />
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
                  Charge a payment
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#6b5a56' }}>
                  Create a UPI checkout session and receive a redirect URL
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 800,
                  color: '#7A1F2B',
                  backgroundColor: 'rgba(122, 31, 43, 0.08)',
                  border: '1px solid rgba(122, 31, 43, 0.15)',
                  padding: '5px 10px',
                  borderRadius: 999,
                }}
              >
                POST /v1/charge
              </span>
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 800,
                  color: '#16a34a',
                  backgroundColor: 'rgba(22, 163, 74, 0.1)',
                  border: '1px solid rgba(22, 163, 74, 0.25)',
                  padding: '5px 10px',
                  borderRadius: 999,
                }}
              >
                HTTP 200 OK
              </span>
            </div>
          </div>

          <div
            style={{
              position: 'relative',
              backgroundColor: '#241417',
              color: '#F6E7C8',
              padding: '20px 20px 20px',
              borderRadius: 16,
              overflow: 'auto',
            }}
          >
            <div style={{ position: 'absolute', top: 12, right: 12 }}>
              <button
                type="button"
                onClick={() => copyCode(curlSnippet, 'charge')}
                style={{
                  height: 32,
                  padding: '0 12px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.15)',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: 11.5,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                }}
              >
                {copiedSection === 'charge' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSection === 'charge' ? 'Copied' : 'Copy cURL'}
              </button>
            </div>
            <pre
              style={{
                margin: 0,
                paddingRight: 120,
                fontSize: 12.5,
                lineHeight: 1.65,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              }}
            >
              {curlSnippet}
            </pre>
          </div>
        </div>

        <div style={cardStyle}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              marginBottom: 16,
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
                Sample Response (JSON)
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#6b5a56' }}>
                Successful charge initiation payload
              </p>
            </div>
            <CopyButton section="response" value={responseJson} label="Copy JSON" />
          </div>
          <div
            style={{
              backgroundColor: '#FBF8F2',
              padding: 20,
              borderRadius: 16,
              border: '1px solid rgba(122, 31, 43, 0.1)',
              overflow: 'auto',
            }}
          >
            <pre
              style={{
                margin: 0,
                fontSize: 13,
                lineHeight: 1.65,
                color: '#241417',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              }}
            >
              {responseJson}
            </pre>
          </div>
        </div>
      </div>
    </PayVangLayout>
  );
}
