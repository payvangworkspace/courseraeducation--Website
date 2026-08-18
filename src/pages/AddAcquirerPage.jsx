import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Braces, Building2, CheckCircle2, KeyRound, Link2 } from 'lucide-react';
import PayVangLayout from '../components/layout/PayVangLayout';
import { apiMasterApi } from '../api';

const DEFAULT_HEADERS = '{\n  "Content-Type": "application/json",\n  "authorization": "",\n  "payload": ""\n}';
const DEFAULT_TEMPLATE = '{\n  "merchant_id": "",\n  "txn_amount": "",\n  "currency": "INR",\n  "txn_unique_id": "",\n  "customer_name": "",\n  "email_address": "",\n  "mobile_number": "",\n  "remarks": "",\n  "payment_mode": "ALL"\n}';

const EMPTY_FORM = {
  id: '',
  aggregatorCode: '',
  apiName: '',
  type: 'PAYIN',
  httpMethod: 'POST',
  environment: 'UAT',
  active: true,
  baseUrl: '',
  endpoint: '',
  responseUrl: '',
  webhoockUrl: '',
  merchantId: '',
  clientId: 'NA',
  secretKey: '',
  responsekey: '',
  headers: DEFAULT_HEADERS,
  requestTemplate: DEFAULT_TEMPLATE,
};

const fieldStyle = {
  width: '100%',
  height: '44px',
  backgroundColor: '#FAF2E8',
  border: '1px solid rgba(122, 31, 43, 0.15)',
  color: '#241417',
  fontSize: '13.5px',
  fontWeight: 500,
  borderRadius: '12px',
  padding: '0 16px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

const labelStyle = {
  display: 'block',
  fontSize: '11.5px',
  fontWeight: 800,
  color: '#7A1F2B',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: '8px',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '20px 24px',
};

function unwrapObject(value) {
  if (!value || typeof value !== 'object') return {};
  if (value.data && typeof value.data === 'object' && !Array.isArray(value.data)) return value.data;
  return value;
}

function focusHandlers(hasError = false) {
  return {
    onFocus: (event) => {
      event.target.style.borderColor = hasError ? '#dc2626' : '#7A1F2B';
      event.target.style.boxShadow = `0 0 0 3px ${hasError ? 'rgba(220,38,38,.12)' : 'rgba(122,31,43,.14)'}`;
      event.target.style.backgroundColor = '#fffdf9';
    },
    onBlur: (event) => {
      event.target.style.borderColor = hasError ? 'rgba(220,38,38,.45)' : 'rgba(122,31,43,.15)';
      event.target.style.boxShadow = 'none';
      event.target.style.backgroundColor = '#FAF2E8';
    },
  };
}

function Field({ label, required, error, children }) {
  return (
    <div style={{ minWidth: 0 }}>
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: '#C99A3D', marginLeft: 4 }}>*</span>}
      </label>
      {children}
      {error && <p style={{ margin: '6px 0 0', color: '#b91c1c', fontSize: 12, fontWeight: 600 }}>{error}</p>}
    </div>
  );
}

function Section({ icon, iconBg, iconColor, title, subtitle, action, children }) {
  return (
    <section
      style={{
        backgroundColor: '#FFFCFA',
        border: '1px solid rgba(122, 31, 43, 0.1)',
        borderRadius: 18,
        padding: 24,
        marginBottom: 24,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          paddingBottom: 18,
          marginBottom: 22,
          borderBottom: '1px solid rgba(122,31,43,.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              backgroundColor: iconBg,
              color: iconColor,
            }}
          >
            {icon}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#7A1F2B' }}>{title}</h3>
            <p style={{ margin: '2px 0 0', fontSize: 12.5, color: '#6b5a56' }}>{subtitle}</p>
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function TextInput({ name, value, onChange, placeholder, type = 'text', error }) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ ...fieldStyle, borderColor: error ? 'rgba(220,38,38,.45)' : fieldStyle.border.split(' ').at(-1) }}
      {...focusHandlers(Boolean(error))}
    />
  );
}

export default function AddAcquirerPage() {
  const navigate = useNavigate();
  const { acquirerId } = useParams();
  const isEdit = Boolean(acquirerId);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!acquirerId) return undefined;
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const item = unwrapObject(await apiMasterApi.getApiById(acquirerId));
        if (!cancelled) {
          setFormData({
            ...EMPTY_FORM,
            ...item,
            id: item.id || acquirerId,
            headers: JSON.stringify(item.headers || {}, null, 2),
            requestTemplate: JSON.stringify(item.requestTemplate || {}, null, 2),
          });
        }
      } catch (error) {
        if (!cancelled) setErrors({ server: error.message || 'Unable to load API configuration.' });
      }
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [acquirerId]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((previous) => ({ ...previous, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((previous) => ({ ...previous, [name]: '' }));
  };

  const handleClear = () => {
    setFormData(isEdit ? { ...EMPTY_FORM, id: formData.id } : EMPTY_FORM);
    setErrors({});
    setSuccess('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    for (const [key, label] of [
      ['aggregatorCode', 'Aggregator Code'],
      ['apiName', 'API Name'],
      ['baseUrl', 'Base URL'],
      ['endpoint', 'Endpoint'],
    ]) {
      if (!formData[key].trim()) nextErrors[key] = `${label} is required`;
    }

    let headers;
    let requestTemplate;
    try {
      headers = JSON.parse(formData.headers);
    } catch {
      nextErrors.headers = 'Headers must contain valid JSON';
    }
    try {
      requestTemplate = JSON.parse(formData.requestTemplate);
    } catch {
      nextErrors.requestTemplate = 'Request template must contain valid JSON';
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const payload = {
      ...(isEdit && { id: formData.id || acquirerId }),
      aggregatorCode: formData.aggregatorCode.trim(),
      apiName: formData.apiName.trim(),
      baseUrl: formData.baseUrl.trim(),
      endpoint: formData.endpoint.trim(),
      httpMethod: formData.httpMethod,
      type: formData.type,
      merchantId: formData.merchantId.trim(),
      secretKey: formData.secretKey,
      clientId: formData.clientId.trim(),
      responseUrl: formData.responseUrl.trim(),
      webhoockUrl: formData.webhoockUrl.trim(),
      responsekey: formData.responsekey,
      active: formData.active,
      headers,
      requestTemplate,
      environment: formData.environment,
    };

    setSubmitting(true);
    setErrors({});
    try {
      if (isEdit) await apiMasterApi.updateApiMaster(payload);
      else await apiMasterApi.saveApiMaster(payload);
      setSuccess(`API configuration "${payload.apiName}" ${isEdit ? 'updated' : 'created'} successfully.`);
      setTimeout(() => navigate('/home/user-management/acquirers'), 1200);
    } catch (error) {
      setErrors({ server: error.message || error.data?.message || 'Failed to save API configuration.' });
    } finally {
      setSubmitting(false);
    }
  };

  const statusControl = (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer',
        padding: '8px 16px',
        borderRadius: 9999,
        backgroundColor: formData.active ? 'rgba(22,163,74,.08)' : 'rgba(158,137,132,.12)',
        border: `1px solid ${formData.active ? 'rgba(22,163,74,.28)' : 'rgba(158,137,132,.3)'}`,
      }}
    >
      <input
        type="checkbox"
        name="active"
        checked={formData.active}
        onChange={handleChange}
        style={{ width: 16, height: 16, margin: 0, accentColor: '#7A1F2B' }}
      />
      <span style={{ fontSize: 12.5, fontWeight: 800, color: formData.active ? '#15803d' : '#6b5a56' }}>
        {formData.active ? 'ACTIVE' : 'INACTIVE'}
      </span>
    </label>
  );

  const selectStyle = { ...fieldStyle, cursor: 'pointer' };

  return (
    <PayVangLayout
      title={isEdit ? 'Edit Acquirer Gateway API' : 'Add Acquirer Gateway API'}
      subtitle="Configure connector endpoints, credentials, headers and request template."
    >
      <div
        style={{
          width: '100%',
          backgroundColor: '#fff',
          borderRadius: 24,
          padding: '28px 32px 32px',
          border: '1px solid rgba(122,31,43,.12)',
          boxShadow: '0 4px 20px rgba(122,31,43,.04)',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
            paddingBottom: 18,
            marginBottom: 24,
            borderBottom: '1px solid rgba(122,31,43,.1)',
          }}
        >
          <button
            type="button"
            onClick={() => navigate('/home/user-management/acquirers')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: 0, border: 0, background: 'none', color: '#7A1F2B', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
          >
            <ArrowLeft style={{ width: 16, height: 16 }} /> Back to Acquirers List
          </button>
          <span style={{ padding: '6px 12px', borderRadius: 9999, background: 'rgba(122,31,43,.08)', border: '1px solid rgba(122,31,43,.15)', color: '#7A1F2B', fontSize: 11, fontWeight: 800 }}>
            API MASTER SETUP
          </span>
        </div>

        {(success || errors.server) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', marginBottom: 20, borderRadius: 14, fontSize: 13, fontWeight: 600, color: success ? '#15803d' : '#b91c1c', background: success ? 'rgba(22,163,74,.08)' : 'rgba(220,38,38,.08)', border: `1px solid ${success ? 'rgba(22,163,74,.28)' : 'rgba(220,38,38,.28)'}` }}>
            {success ? <CheckCircle2 style={{ width: 18 }} /> : <AlertCircle style={{ width: 18 }} />}
            {success || errors.server}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Section
            icon={<Building2 style={{ width: 18 }} />}
            iconBg="rgba(122,31,43,.08)"
            iconColor="#7A1F2B"
            title="Gateway Profile"
            subtitle="Aggregator identity, transaction type and runtime environment"
            action={statusControl}
          >
            <div style={gridStyle}>
              <Field label="Aggregator Code" required error={errors.aggregatorCode}>
                <TextInput name="aggregatorCode" value={formData.aggregatorCode} onChange={handleChange} placeholder="e.g. HDFC_PG_DIRECT" error={errors.aggregatorCode} />
              </Field>
              <Field label="API Name" required error={errors.apiName}>
                <TextInput name="apiName" value={formData.apiName} onChange={handleChange} placeholder="e.g. HDFC SmartHub Direct" error={errors.apiName} />
              </Field>
              <Field label="Type" required>
                <select name="type" value={formData.type} onChange={handleChange} style={selectStyle}>
                  <option value="PAYIN">PAYIN</option>
                  <option value="PAYOUT">PAYOUT</option>
                </select>
              </Field>
              <Field label="HTTP Method" required>
                <select name="httpMethod" value={formData.httpMethod} onChange={handleChange} style={selectStyle}>
                  <option value="GET">GET</option>
                  <option value="PUT">PUT</option>
                  <option value="POST">POST</option>
                </select>
              </Field>
              <Field label="Environment" required>
                <select name="environment" value={formData.environment} onChange={handleChange} style={selectStyle}>
                  <option value="UAT">UAT</option>
                  <option value="PROD">PROD</option>
                </select>
              </Field>
            </div>
          </Section>

          <Section
            icon={<Link2 style={{ width: 18 }} />}
            iconBg="rgba(22,163,74,.11)"
            iconColor="#15803d"
            title="Endpoint Configuration"
            subtitle="Gateway endpoint and callback destinations"
          >
            <div style={gridStyle}>
              <Field label="Base URL" required error={errors.baseUrl}>
                <TextInput name="baseUrl" value={formData.baseUrl} onChange={handleChange} placeholder="https://api.gateway.com/v2" error={errors.baseUrl} />
              </Field>
              <Field label="Endpoint" required error={errors.endpoint}>
                <TextInput name="endpoint" value={formData.endpoint} onChange={handleChange} placeholder="/charge" error={errors.endpoint} />
              </Field>
              <Field label="Response URL">
                <TextInput name="responseUrl" value={formData.responseUrl} onChange={handleChange} placeholder="https://courseraeducation.com/callback" />
              </Field>
              <Field label="Webhook URL">
                <TextInput name="webhoockUrl" value={formData.webhoockUrl} onChange={handleChange} placeholder="https://courseraeducation.com/webhook" />
              </Field>
            </div>
          </Section>

          <Section
            icon={<KeyRound style={{ width: 18 }} />}
            iconBg="rgba(201,154,61,.14)"
            iconColor="#C99A3D"
            title="Gateway Credentials"
            subtitle="Merchant identifiers and secrets supplied by the provider"
          >
            <div style={gridStyle}>
              <Field label="Merchant ID">
                <TextInput name="merchantId" value={formData.merchantId} onChange={handleChange} placeholder="Enter merchant ID" />
              </Field>
              <Field label="Client ID">
                <TextInput name="clientId" value={formData.clientId} onChange={handleChange} placeholder="Enter client ID" />
              </Field>
              <Field label="Secret Key">
                <TextInput type="password" name="secretKey" value={formData.secretKey} onChange={handleChange} placeholder="Enter secret key" />
              </Field>
              <Field label="Response Key">
                <TextInput type="password" name="responsekey" value={formData.responsekey} onChange={handleChange} placeholder="Enter response key" />
              </Field>
            </div>
          </Section>

          <Section
            icon={<Braces style={{ width: 18 }} />}
            iconBg="rgba(122,31,43,.08)"
            iconColor="#7A1F2B"
            title="Request Configuration"
            subtitle="Valid JSON objects sent as headers and request payload template"
          >
            <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              <Field label="HTTP Headers (JSON)" required error={errors.headers}>
                <textarea
                  name="headers"
                  rows={10}
                  value={formData.headers}
                  onChange={handleChange}
                  style={{ ...fieldStyle, height: 230, padding: 16, resize: 'vertical', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', lineHeight: 1.55, background: '#241417', color: '#E5C378' }}
                />
              </Field>
              <Field label="Request Payload Template (JSON)" required error={errors.requestTemplate}>
                <textarea
                  name="requestTemplate"
                  rows={10}
                  value={formData.requestTemplate}
                  onChange={handleChange}
                  style={{ ...fieldStyle, height: 230, padding: 16, resize: 'vertical', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', lineHeight: 1.55, background: '#241417', color: '#86efac' }}
                />
              </Field>
            </div>
          </Section>

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10, flexWrap: 'wrap', paddingTop: 20, borderTop: '1px solid rgba(122,31,43,.1)' }}>
            <button type="button" onClick={() => navigate('/home/user-management/acquirers')} style={{ height: 42, padding: '0 20px', borderRadius: 9999, border: '1px solid rgba(122,31,43,.2)', background: '#fff', color: '#7A1F2B', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Back</button>
            <button type="button" onClick={handleClear} style={{ height: 42, padding: '0 20px', borderRadius: 9999, border: '1px solid rgba(158,137,132,.45)', background: '#FAF2E8', color: '#6b5a56', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Clear Form</button>
            <button type="submit" disabled={submitting} style={{ height: 42, padding: '0 24px', borderRadius: 9999, border: 0, background: submitting ? 'rgba(122,31,43,.45)' : 'linear-gradient(135deg,#7A1F2B 0%,#C99A3D 100%)', color: '#fff', fontWeight: 700, fontSize: 13, cursor: submitting ? 'not-allowed' : 'pointer' }}>
              {submitting ? 'Saving...' : isEdit ? 'Update Gateway API' : 'Submit & Create API'}
            </button>
          </div>
        </form>
      </div>
    </PayVangLayout>
  );
}
