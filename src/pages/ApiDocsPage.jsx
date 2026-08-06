import React, { useState } from 'react';
import PayVangLayout from '../components/layout/PayVangLayout';
import { Code2, Copy, Check, Terminal, Key, ShieldAlert } from 'lucide-react';

export default function ApiDocsPage() {
  const [copiedSection, setCopiedSection] = useState(null);

  const copyCode = (code, section) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const curlSnippet = `curl -X POST https://api.payvang.com/v1/charge \\
  -H "X-PayVang-Key: pvk_live_998127391823" \\
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

  return (
    <PayVangLayout title="API Documentation" subtitle="Developer API references, SDK integration guidelines & authentication headers.">
      <div className="space-y-6">
        {/* API CREDENTIALS BANNER */}
        <div className="coursera-card bg-gradient-to-r from-[#241417] via-[#3D141C] to-[#7A1F2B] text-white p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-[#C99A3D]" />
              <h3 className="text-lg font-bold font-heading text-white">Live Production API Keys</h3>
            </div>
            <p className="text-xs text-amber-100/80">Keep your secret keys secure. Never expose secret keys in client-side code.</p>
          </div>
          <div className="bg-[#FAF2E8]/10 backdrop-blur-md p-3 rounded-xl border border-white/10 font-mono text-xs text-amber-200">
            X-PayVang-Key: <span className="text-white font-bold">pvk_live_998127391823</span>
          </div>
        </div>

        {/* ENDPOINTS OVERVIEW */}
        <div className="coursera-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#7A1F2B]" />
              <h3 className="text-lg font-bold text-[#7A1F2B] font-heading">POST /v1/charge</h3>
            </div>
            <span className="coursera-badge-green">HTTP 200 OK</span>
          </div>

          <div className="relative bg-[#241417] text-amber-200 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-[#7A1F2B]/30">
            <button
              onClick={() => copyCode(curlSnippet, 'charge')}
              className="absolute right-3 top-3 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-md flex items-center gap-1 text-[11px]"
            >
              {copiedSection === 'charge' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === 'charge' ? 'Copied' : 'Copy cURL'}
            </button>
            <pre>{curlSnippet}</pre>
          </div>
        </div>

        {/* RESPONSE SAMPLE */}
        <div className="coursera-card p-6 space-y-3">
          <h4 className="text-sm font-bold text-[#7A1F2B]">Sample Response (JSON)</h4>
          <div className="bg-[#FAF2E8] p-4 rounded-xl text-xs font-mono text-[#241417] border border-[#7A1F2B]/15">
            <pre>{JSON.stringify({
              status: "success",
              code: "PAYMENT_INITIATED",
              transaction_id: "TXN-90124",
              amount: 4999.00,
              currency: "INR",
              gateway_redirect_url: "https://payvang.com/pay/session/90124"
            }, null, 2)}</pre>
          </div>
        </div>
      </div>
    </PayVangLayout>
  );
}
