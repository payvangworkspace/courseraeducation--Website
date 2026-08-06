import React, { useState } from 'react';
import PayVangLayout from '../components/layout/PayVangLayout';
import GradientButton from '../components/common/GradientButton';
import { Settings, Shield, Bell, Key, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [webhookUrl, setWebhookUrl] = useState('https://api.merchant.com/payvang/webhooks');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <PayVangLayout title="Settings" subtitle="Gateway parameters, security preferences & global notifications.">
      <div className="coursera-card p-6 md:p-8 max-w-4xl mx-auto space-y-6">
        <h3 className="text-xl font-bold text-[#7A1F2B] font-heading pb-3 border-b border-[#7A1F2B]/10">Platform Configuration</h3>

        {saved && (
          <div className="p-3.5 bg-[#16a34a]/10 border border-[#16a34a]/30 text-[#15803d] rounded-xl flex items-center gap-2 text-sm font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#7A1F2B] uppercase mb-1.5">Webhook Endpoint URL</label>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full bg-[#FAF2E8] border border-[#7A1F2B]/15 text-[#241417] text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#7A1F2B]"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-[#FBF3E7] rounded-xl border border-[#7A1F2B]/10">
              <div>
                <span className="text-sm font-bold text-[#7A1F2B] block">Enforce 3D Secure 2.2</span>
                <span className="text-xs text-[#6b5a56]">Require OTP authentication on all debit/credit card transactions</span>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#7A1F2B]" />
            </div>

            <div className="flex items-center justify-between p-4 bg-[#FBF3E7] rounded-xl border border-[#7A1F2B]/10">
              <div>
                <span className="text-sm font-bold text-[#7A1F2B] block">Auto-Settlement Nightly Cron</span>
                <span className="text-xs text-[#6b5a56]">Automatically trigger batch clearing at 23:00 IST</span>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#7A1F2B]" />
            </div>
          </div>

          <div className="pt-4 border-t border-[#7A1F2B]/10 text-right">
            <GradientButton type="submit">Save Changes</GradientButton>
          </div>
        </form>
      </div>
    </PayVangLayout>
  );
}
