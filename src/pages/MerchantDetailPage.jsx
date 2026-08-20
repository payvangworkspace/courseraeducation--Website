import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PayVangLayout from '../components/layout/PayVangLayout';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  CircleUser,
  Copy,
  Eye,
  EyeOff,
  Mail,
  MapPin,
  Pencil,
  Phone,
  RefreshCw,
  User,
  Wallet,
  XCircle,
} from 'lucide-react';
import { merchantApi, unwrapList, walletApi } from '../api';
import {
  AggregatorPanel,
  BusinessPanel,
  CurrencyPanel,
  DocumentsPanel,
  FeesPanel,
  PayoutPanel,
  SwaggerGap,
  WebhooksPanel,
} from './MerchantDetailPanels';

const ADMIN_OPTS = { includePayVangHeaders: false };

const TABS = [
  { id: 'operational', label: 'Operational' },
  { id: 'business', label: 'Business' },
  { id: 'payin', label: 'Payin' },
  { id: 'payout', label: 'Payout' },
  { id: 'documents', label: 'Documents' },
  { id: 'currency', label: 'Currency' },
  { id: 'country', label: 'Country' },
  { id: 'webhooks', label: 'Web Hooks' },
  { id: 'settlement', label: 'Settlement Cycle' },
  { id: 'fees', label: 'Fees & Limit' },
  { id: 'aggregator', label: 'Merchant Aggregator' },
];

const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: 24,
  padding: 28,
  border: '1px solid rgba(122, 31, 43, 0.12)',
  boxShadow: '0 4px 20px rgba(122, 31, 43, 0.04)',
};

function pickFirst(...values) {
  for (const value of values) {
    if (value !== null && value !== undefined && String(value).trim() !== '') {
      return value;
    }
  }
  return '';
}

function unwrapObject(data) {
  if (!data || typeof data !== 'object') return {};
  if (Array.isArray(data)) return data[0] && typeof data[0] === 'object' ? data[0] : {};
  const nested = data.data || data.result || data.user || data.merchant || data.details;
  if (nested && typeof nested === 'object' && !Array.isArray(nested)) return { ...data, ...nested };
  return data;
}

function toBool(value) {
  if (value === true || value === 1) return true;
  if (value === false || value === 0) return false;
  const s = String(value ?? '').trim().toLowerCase();
  if (['true', 'enable', 'enabled', 'active', 'yes', '1', 'sale'].includes(s)) return true;
  if (['false', 'disable', 'disabled', 'inactive', 'no', '0', 'auth'].includes(s)) return false;
  return Boolean(s);
}

function toTitleCase(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  return raw.toLowerCase().replace(/\b([a-z])/g, (char) => char.toUpperCase());
}

function formatDate(value) {
  const raw = pickFirst(value);
  if (!raw) return '—';
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return String(raw);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

function formatMoney(value, currency = 'INR') {
  const n = Number(String(value ?? '').replace(/[₹$,\s]/g, ''));
  if (!Number.isFinite(n)) return `${currency} 0.00`;
  return `${currency} ${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function dash(value) {
  const raw = pickFirst(value);
  return raw === '' ? '—' : String(raw);
}

function Toggle({ checked, onChange, disabled, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      style={{
        width: 48,
        height: 28,
        borderRadius: 999,
        border: 'none',
        padding: 3,
        cursor: disabled ? 'not-allowed' : 'pointer',
        flexShrink: 0,
        opacity: disabled ? 0.55 : 1,
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

function StatusRow({ label, value, checked, onToggle, saving, last }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(180px, 1.1fr) minmax(140px, 1fr) auto',
        alignItems: 'center',
        gap: 16,
        padding: '16px 20px',
        borderBottom: last ? 'none' : '1px solid rgba(122, 31, 43, 0.06)',
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 800, color: '#241417' }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#6b5a56', display: 'flex', alignItems: 'center' }}>
        {value}
      </div>
      {onToggle ? (
        <Toggle checked={checked} onChange={onToggle} disabled={saving} label={label} />
      ) : (
        <span style={{ width: 48 }} />
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(122, 31, 43, 0.06)' }}>
      <span style={{ minWidth: 150, fontSize: 12, fontWeight: 800, color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </span>
      <span style={{ fontSize: 13.5, fontWeight: 600, color: '#241417', wordBreak: 'break-word' }}>{value || '—'}</span>
    </div>
  );
}

function StatusBadge({ active, onLabel = 'Active', offLabel = 'Inactive' }) {
  return (
    <span
      style={{
        fontSize: 11.5,
        fontWeight: 800,
        padding: '4px 10px',
        borderRadius: 999,
        backgroundColor: active ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)',
        color: active ? '#16a34a' : '#dc2626',
        border: `1px solid ${active ? 'rgba(22,163,74,0.25)' : 'rgba(220,38,38,0.25)'}`,
      }}
    >
      {active ? onLabel : offLabel}
    </span>
  );
}

function enableLabel(on) {
  return on ? 'Enable' : 'Disable';
}

function matchesMerchant(row, identifier) {
  const target = String(identifier || '').trim().toLowerCase();
  if (!target) return false;
  return ['merchantId', 'userId', 'emailId', 'email', 'merchantEmail', 'userName']
    .map((key) => row?.[key])
    .filter((value) => value !== undefined && value !== null)
    .some((value) => String(value).trim().toLowerCase() === target);
}

/**
 * The payout service answers 400 "Merchant not found" for merchants that have no
 * wallet yet, so resolve the balance from the wallet list and only fall back to the
 * per-merchant endpoint when that list is unavailable.
 */
async function resolveWallet(identifier) {
  try {
    const list = unwrapList(await walletApi.getWalletList(ADMIN_OPTS));
    const match = list.find((row) => matchesMerchant(row, identifier));
    return match ? unwrapObject(match) : {};
  } catch {
    try {
      const raw = await walletApi.getWalletByMerchantId(identifier, ADMIN_OPTS);
      const list = unwrapList(raw);
      return list[0] ? unwrapObject(list[0]) : unwrapObject(raw);
    } catch {
      return {};
    }
  }
}

export default function MerchantDetailPage() {
  const { userId: rawUserId } = useParams();
  const userId = decodeURIComponent(rawUserId || '');
  const navigate = useNavigate();
  const location = useLocation();
  const preview = useMemo(() => location.state?.merchant || {}, [location.state]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [merchant, setMerchant] = useState({});
  const [personal, setPersonal] = useState({});
  const [account, setAccount] = useState({});
  const [wallet, setWallet] = useState({});
  const [activeTab, setActiveTab] = useState('operational');
  const [savingKey, setSavingKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const merged = useMemo(
    () => ({ ...preview, ...account, ...personal, ...merchant }),
    [preview, account, personal, merchant]
  );

  const flags = useMemo(() => {
    const processing = String(pickFirst(merged.processingMode, merged.txnProcessingMode) || '').toUpperCase();
    const saleMode =
      processing === 'SALE' ? true : processing === 'AUTH' ? false : !toBool(merged.authStatus);
    return {
      status: toBool(pickFirst(merged.status, merged.enabled, merged.accountNonLocked, true)),
      saleMode,
      verified: toBool(pickFirst(merged.verified, merged.isVerified, merged.verificationStatus)),
      payout: toBool(pickFirst(merged.payoutEnabled, merged.payoutStatus)),
      payin: toBool(pickFirst(merged.payinEnabled, merged.payinStatus)),
      gstPayin: toBool(pickFirst(merged.payinGstEnabled, merged.payinGstStatus)),
      gstPayout: toBool(pickFirst(merged.payoutGstEnabled, merged.payoutGstStatus)),
      payoutFeeRefund: toBool(pickFirst(merged.feeReturnOnRefund, merged.payoutFeeReturnStatus)),
      payoutFromWebapp: toBool(
        pickFirst(merged.payoutEnabledViaApp, merged.payoutStatusViaApplication)
      ),
    };
  }, [merged]);

  const displayName = toTitleCase(pickFirst(merged.fullName, merged.name, preview.name)) || 'Merchant';
  const email = dash(pickFirst(merged.email, merged.emailId, merged.emailID, preview.email, userId));
  const phone = dash(pickFirst(merged.contactNumber, merged.phone, merged.mobile, merged.phoneNumber, preview.contactNumber));
  const businessName = toTitleCase(pickFirst(merged.businessName, merged.companyName, preview.businessName)) || '—';
  const merchantCode = dash(pickFirst(merged.merchantCode, merged.shortCode, merged.merchantShortCode));
  const appId = dash(pickFirst(merged.appId, merged.merchantAppId, merged.applicationId, merged.userId));
  const secretKey = dash(pickFirst(merged.secretKey, merged.appKey, merged.merchantSecretId));
  const registrationDate = formatDate(
    pickFirst(merged.createdDate, merged.registrationDate, merged.createdOn, merged.createdAt, preview.registrationDate)
  );
  const verificationDate = formatDate(
    pickFirst(merged.verificationDate, merged.verifiedOn, merged.activationDate, preview.activationDate)
  );
  const walletBalance = formatMoney(
    pickFirst(wallet.netBalance, wallet.balance, wallet.availableBalance, merged.walletBalance, 0),
    pickFirst(wallet.currency, merged.currency, 'INR')
  );

  const loadProfile = async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const [merchantRes, personalRes, accountRes, walletRes] = await Promise.allSettled([
        merchantApi.getMerchant(userId, ADMIN_OPTS),
        merchantApi.getPersonalDetails(userId, ADMIN_OPTS),
        merchantApi.getAccountDetails(userId, ADMIN_OPTS),
        resolveWallet(userId),
      ]);

      if (merchantRes.status === 'fulfilled') setMerchant(unwrapObject(merchantRes.value));
      if (personalRes.status === 'fulfilled') setPersonal(unwrapObject(personalRes.value));
      if (accountRes.status === 'fulfilled') setAccount(unwrapObject(accountRes.value));
      if (walletRes.status === 'fulfilled') setWallet(walletRes.value);

      if (
        merchantRes.status === 'rejected' &&
        personalRes.status === 'rejected' &&
        accountRes.status === 'rejected' &&
        !preview.id
      ) {
        setError(merchantRes.reason?.message || 'Unable to load merchant details.');
      }
    } catch (err) {
      setError(err.message || 'Unable to load merchant details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return undefined;
    const timer = window.setTimeout(loadProfile, 0);
    return () => window.clearTimeout(timer);
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const runToggle = async (key, request) => {
    setSavingKey(key);
    setNotice('');
    try {
      await request();
      await loadProfile();
    } catch (err) {
      setNotice(err.message || `Failed to update ${key}.`);
    } finally {
      setSavingKey('');
    }
  };

  const copyAppId = async () => {
    if (!appId || appId === '—') return;
    try {
      await navigator.clipboard.writeText(appId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setNotice('Unable to copy App ID.');
    }
  };

  const operationalRows = [
    {
      key: 'status',
      label: 'Status',
      value: enableLabel(flags.status),
      checked: flags.status,
      onToggle: () =>
        runToggle('status', () => merchantApi.updateLockedStatus(userId, ADMIN_OPTS)),
    },
    {
      key: 'saleMode',
      label: 'Processing Mode',
      value: flags.saleMode ? 'SALE' : 'AUTH',
      checked: flags.saleMode,
      onToggle: () =>
        runToggle('saleMode', () => merchantApi.updateAuthStatus(userId, ADMIN_OPTS)),
    },
    {
      key: 'verified',
      label: 'Verified',
      value: flags.verified ? (
        <CheckCircle2 style={{ width: 18, height: 18, color: '#16a34a' }} />
      ) : (
        <XCircle style={{ width: 18, height: 18, color: '#dc2626' }} />
      ),
      checked: flags.verified,
      onToggle: () =>
        runToggle('verified', () => merchantApi.verifyUser(userId, ADMIN_OPTS)),
    },
    {
      key: 'payout',
      label: 'Payout',
      value: enableLabel(flags.payout),
      checked: flags.payout,
      onToggle: () =>
        runToggle('payout', () => merchantApi.updatePayoutStatus(userId, ADMIN_OPTS)),
    },
    {
      key: 'payin',
      label: 'Payin',
      value: enableLabel(flags.payin),
      checked: flags.payin,
      onToggle: () =>
        runToggle('payin', () => merchantApi.updatePayinStatus(userId, ADMIN_OPTS)),
    },
    {
      key: 'gstPayin',
      label: 'GST Payin',
      value: enableLabel(flags.gstPayin),
      checked: flags.gstPayin,
      onToggle: () =>
        runToggle('gstPayin', () => merchantApi.updatePayinGstStatus(userId, ADMIN_OPTS)),
    },
    {
      key: 'gstPayout',
      label: 'GST Payout',
      value: enableLabel(flags.gstPayout),
      checked: flags.gstPayout,
      onToggle: () =>
        runToggle('gstPayout', () => merchantApi.updatePayoutGstStatus(userId, ADMIN_OPTS)),
    },
    {
      key: 'payoutFeeRefund',
      label: 'Payout Fee Refund Status',
      value: enableLabel(flags.payoutFeeRefund),
      checked: flags.payoutFeeRefund,
      onToggle: () =>
        runToggle(
          'payoutFeeRefund',
          () => merchantApi.updatePayoutFeeReturnStatus(userId, ADMIN_OPTS)
        ),
    },
    {
      key: 'payoutFromWebapp',
      label: 'Payout From Webapp',
      value: enableLabel(flags.payoutFromWebapp),
      checked: flags.payoutFromWebapp,
      onToggle: () =>
        runToggle(
          'payoutFromWebapp',
          () => merchantApi.updatePayoutStatusViaApplication(userId, ADMIN_OPTS)
        ),
    },
  ];

  const renderTab = () => {
    if (activeTab === 'operational') {
      return (
        <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(122, 31, 43, 0.1)' }}>
          {operationalRows.map((row, index) => (
            <div key={row.key} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#FBF6EE' }}>
              <StatusRow
                label={row.label}
                value={row.value}
                checked={row.checked}
                onToggle={row.onToggle}
                saving={savingKey === row.key}
              />
            </div>
          ))}
          <div style={{ backgroundColor: operationalRows.length % 2 === 0 ? '#ffffff' : '#FBF6EE' }}>
            <StatusRow
              label="App ID"
              value={
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12.5 }}>{appId}</span>
                  {appId !== '—' && (
                    <button
                      type="button"
                      onClick={copyAppId}
                      title="Copy App ID"
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: '#7A1F2B',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'inline-flex',
                      }}
                    >
                      <Copy style={{ width: 14, height: 14 }} />
                    </button>
                  )}
                  {copied ? <span style={{ color: '#16a34a', fontSize: 11 }}>Copied</span> : null}
                </span>
              }
            />
          </div>
          <div style={{ backgroundColor: operationalRows.length % 2 === 0 ? '#FBF6EE' : '#ffffff' }}>
            <StatusRow
              label="Secret Key"
              value={
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12.5 }}>
                    {secretKey === '—'
                      ? '—'
                      : showSecret
                      ? secretKey
                      : `${String(secretKey).slice(0, 4)}${'•'.repeat(Math.min(12, Math.max(4, String(secretKey).length - 8)))}${String(secretKey).slice(-4)}`}
                  </span>
                  {secretKey !== '—' ? (
                    <button
                      type="button"
                      onClick={() => setShowSecret((visible) => !visible)}
                      aria-label={showSecret ? 'Hide secret key' : 'Show secret key'}
                      style={{ border: 0, background: 'transparent', color: '#7A1F2B', cursor: 'pointer', padding: 0, display: 'inline-flex' }}
                    >
                      {showSecret ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  ) : null}
                </span>
              }
              last
            />
          </div>
        </div>
      );
    }

    if (activeTab === 'business') {
      return <BusinessPanel userId={userId} merchantName={displayName} merchant={merged} onUpdated={() => loadProfile({ silent: true })} />;
    }

    if (activeTab === 'payin') {
      return (
        <div style={{ display: 'grid', gap: 18 }}>
          <InfoRow label="Payin Status" value={<StatusBadge active={flags.payin} onLabel="Enable" offLabel="Disable" />} />
          <InfoRow label="GST Payin" value={<StatusBadge active={flags.gstPayin} onLabel="Enable" offLabel="Disable" />} />
          <InfoRow label="Processing Mode" value={flags.saleMode ? 'SALE' : 'AUTH'} />
          <InfoRow label="Webhook URL" value={dash(merged.payinWebhookUrl)} />
          <SwaggerGap title="TDR Settings">
            The published Swagger specification does not expose a merchant Payin TDR settings endpoint. No placeholder data is shown or saved.
          </SwaggerGap>
        </div>
      );
    }

    if (activeTab === 'payout') {
      return <PayoutPanel userId={userId} merchantName={displayName} />;
    }

    if (activeTab === 'documents') {
      return <DocumentsPanel userId={userId} merchantName={displayName} />;
    }

    if (activeTab === 'currency') {
      return <CurrencyPanel userId={userId} merchantName={displayName} />;
    }

    if (activeTab === 'country') {
      return (
        <div style={{ display: 'grid', gap: 18 }}>
          <InfoRow label="Country" value={dash(pickFirst(merged.country, merged.countryName, merged.countryCode))} />
          <InfoRow label="State" value={dash(pickFirst(merged.state, merged.region))} />
          <InfoRow label="City" value={dash(pickFirst(merged.city))} />
          <InfoRow label="Address" value={dash(pickFirst(merged.addressDetails, merged.address, merged.streetAddress))} />
          <InfoRow label="Postal Code" value={dash(pickFirst(merged.pincode, merged.postalCode, merged.zip))} />
          <SwaggerGap title="Country Mapping">
            Country mapping is read-only because the published Swagger specification contains no country mapping controller.
          </SwaggerGap>
        </div>
      );
    }

    if (activeTab === 'webhooks') {
      return <WebhooksPanel userId={userId} merchantName={displayName} merchant={merged} onUpdated={() => loadProfile({ silent: true })} />;
    }

    if (activeTab === 'settlement') {
      return (
        <SwaggerGap title="Settlement Cycle">
          The published Swagger specification does not include settlement-cycle list or mutation endpoints. This section cannot safely persist the T+ day and time shown in the reference UI.
        </SwaggerGap>
      );
    }

    if (activeTab === 'fees') {
      return <FeesPanel userId={userId} merchantName={displayName} />;
    }

    return <AggregatorPanel userId={userId} merchantName={displayName} />;
  };

  return (
    <PayVangLayout
      title="User Management - Merchants"
      subtitle={`${displayName} · operational controls, onboarding profile and gateway settings.`}
    >
      <button
        type="button"
        onClick={() => navigate('/home/user-management/merchants')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 18,
          border: 'none',
          background: 'transparent',
          color: '#7A1F2B',
          fontWeight: 700,
          fontSize: 13,
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <ArrowLeft style={{ width: 16, height: 16 }} />
        Back to merchants
      </button>

      {error ? (
        <div
          style={{
            ...cardStyle,
            marginBottom: 20,
            borderColor: 'rgba(185, 28, 28, 0.25)',
            backgroundColor: '#FFF7F5',
            color: '#b91c1c',
            fontWeight: 600,
          }}
        >
          {error}
        </div>
      ) : null}

      {loading ? (
        <div style={{ ...cardStyle, display: 'flex', justifyContent: 'center', padding: 56 }}>
          <RefreshCw className="w-8 h-8 text-[#7A1F2B] animate-spin" />
        </div>
      ) : (
        <>
          <div style={{ ...cardStyle, marginBottom: 20 }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(280px, 1.15fr) minmax(240px, 0.85fr)',
                gap: 0,
              }}
              className="merchant-summary-grid"
            >
              <div style={{ paddingRight: 28, borderRight: '1px dashed rgba(122, 31, 43, 0.22)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 22 }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(122, 31, 43, 0.12) 0%, rgba(201, 154, 61, 0.18) 100%)',
                      color: '#7A1F2B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <CircleUser style={{ width: 32, height: 32 }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <h2
                        style={{
                          margin: 0,
                          fontSize: 22,
                          fontWeight: 800,
                          color: '#7A1F2B',
                          fontFamily: "'Space Grotesk', sans-serif",
                        }}
                      >
                        {displayName}
                      </h2>
                      {flags.verified ? <CheckCircle2 style={{ width: 18, height: 18, color: '#16a34a' }} /> : null}
                    </div>
                    <div style={{ marginTop: 4, fontSize: 12.5, fontWeight: 700, color: '#9E8984', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Merchant
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: 10 }}>
                  <SummaryLine label="Merchant ID" value={email} accent />
                  <SummaryLine label="Merchant Code" value={merchantCode} />
                  <SummaryLine label="Registration Date" value={registrationDate} success />
                  <SummaryLine label="Verification Date" value={verificationDate} success />
                  <SummaryLine
                    label="Wallet Balance"
                    value={
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <Wallet style={{ width: 14, height: 14 }} />
                        {walletBalance}
                      </span>
                    }
                    accent
                  />
                </div>
              </div>

              <div style={{ paddingLeft: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Contact
                  </div>
                  <Pencil style={{ width: 15, height: 15, color: '#9E8984' }} />
                </div>
                <ContactLine icon={<Phone style={{ width: 14, height: 14 }} />} label="Phone" value={phone} />
                <ContactLine icon={<Mail style={{ width: 14, height: 14 }} />} label="Email" value={email} />
                <ContactLine icon={<Calendar style={{ width: 14, height: 14 }} />} label="Birthday" value={formatDate(pickFirst(merged.birthday, merged.dateOfBirth, merged.dob))} />
                <ContactLine icon={<MapPin style={{ width: 14, height: 14 }} />} label="Address" value={dash(pickFirst(merged.address, merged.streetAddress, merged.fullAddress))} />
                <ContactLine icon={<User style={{ width: 14, height: 14 }} />} label="Gender" value={dash(pickFirst(merged.gender))} />
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                gap: 4,
                overflowX: 'auto',
                borderBottom: '1px solid rgba(122, 31, 43, 0.1)',
                margin: '-8px -8px 20px',
                padding: '0 8px',
              }}
            >
              {TABS.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setNotice('');
                      setActiveTab(tab.id);
                    }}
                    style={{
                      flexShrink: 0,
                      border: 'none',
                      background: 'transparent',
                      padding: '12px 14px',
                      fontSize: 13,
                      fontWeight: active ? 800 : 600,
                      color: active ? '#7A1F2B' : '#6b5a56',
                      cursor: 'pointer',
                      borderBottom: active ? '2px solid #7A1F2B' : '2px solid transparent',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {notice ? (
              <div
                style={{
                  marginBottom: 16,
                  padding: '10px 14px',
                  borderRadius: 12,
                  backgroundColor: '#FFF7F5',
                  color: '#b91c1c',
                  fontSize: 12.5,
                  fontWeight: 600,
                }}
              >
                {notice}
              </div>
            ) : null}

            {renderTab()}
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 900px) {
          .merchant-summary-grid {
            grid-template-columns: 1fr !important;
          }
          .merchant-summary-grid > div:first-child {
            padding-right: 0 !important;
            border-right: none !important;
            padding-bottom: 22px;
            margin-bottom: 8px;
            border-bottom: 1px dashed rgba(122, 31, 43, 0.22);
          }
          .merchant-summary-grid > div:last-child {
            padding-left: 0 !important;
            padding-top: 12px;
          }
          .merchant-business-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </PayVangLayout>
  );
}

function SummaryLine({ label, value, accent, success }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 10, alignItems: 'center' }}>
      <span style={{ fontSize: 12, fontWeight: 800, color: '#7A1F2B' }}>{label}</span>
      <span
        style={{
          fontSize: 13.5,
          fontWeight: 700,
          color: success ? '#15803d' : accent ? '#7A1F2B' : '#241417',
          wordBreak: 'break-word',
        }}
      >
        {value || '—'}
      </span>
    </div>
  );
}

function ContactLine({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0' }}>
      <span style={{ color: '#9E8984', marginTop: 2 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#9E8984', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: '#241417', wordBreak: 'break-word' }}>{value || '—'}</div>
      </div>
    </div>
  );
}
