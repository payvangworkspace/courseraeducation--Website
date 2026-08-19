import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
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

const columnStyle = { display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0 };

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
    },
    onBlur: (event) => {
      event.target.style.borderColor = hasError ? 'rgba(220,38,38,.45)' : 'rgba(122,31,43,.15)';
      event.target.style.boxShadow = 'none';
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

function TextInput({ name, value, onChange, placeholder, error }) {
  return (
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ ...fieldStyle, borderColor: error ? 'rgba(220,38,38,.45)' : 'rgba(122,31,43,.15)' }}
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

  const selectStyle = { ...fieldStyle, cursor: 'pointer' };
  const jsonStyle = {
    ...fieldStyle,
    height: 'auto',
    padding: 16,
    resize: 'vertical',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    fontSize: 12.5,
    lineHeight: 1.6,
    backgroundColor: '#241417',
  };

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
            marginBottom: 26,
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', marginBottom: 22, borderRadius: 14, fontSize: 13, fontWeight: 600, color: success ? '#15803d' : '#b91c1c', background: success ? 'rgba(22,163,74,.08)' : 'rgba(220,38,38,.08)', border: `1px solid ${success ? 'rgba(22,163,74,.28)' : 'rgba(220,38,38,.28)'}` }}>
            {success ? <CheckCircle2 style={{ width: 18 }} /> : <AlertCircle style={{ width: 18 }} />}
            {success || errors.server}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px 40px' }}>
            {/* LEFT COLUMN */}
            <div style={columnStyle}>
              <Field label="Aggregator Code" required error={errors.aggregatorCode}>
                <TextInput name="aggregatorCode" value={formData.aggregatorCode} onChange={handleChange} placeholder="Enter aggregator code" error={errors.aggregatorCode} />
              </Field>

              <Field label="API Name" required error={errors.apiName}>
                <TextInput name="apiName" value={formData.apiName} onChange={handleChange} placeholder="Enter API name" error={errors.apiName} />
              </Field>

              <Field label="Base URL" required error={errors.baseUrl}>
                <TextInput name="baseUrl" value={formData.baseUrl} onChange={handleChange} placeholder="Enter base URL" error={errors.baseUrl} />
              </Field>

              <Field label="Endpoint" required error={errors.endpoint}>
                <TextInput name="endpoint" value={formData.endpoint} onChange={handleChange} placeholder="Enter endpoint" error={errors.endpoint} />
              </Field>

              <Field label="Response URL">
                <TextInput name="responseUrl" value={formData.responseUrl} onChange={handleChange} placeholder="Enter response URL" />
              </Field>

              <Field label="Webhook URL">
                <TextInput name="webhoockUrl" value={formData.webhoockUrl} onChange={handleChange} placeholder="Enter webhook URL" />
              </Field>

              <Field label="Merchant ID">
                <TextInput name="merchantId" value={formData.merchantId} onChange={handleChange} placeholder="Enter merchant ID" />
              </Field>

              <Field label="Secret Key">
                <TextInput name="secretKey" value={formData.secretKey} onChange={handleChange} placeholder="Enter secret key" />
              </Field>

              <Field label="Response Key">
                <TextInput name="responsekey" value={formData.responsekey} onChange={handleChange} placeholder="Enter response key" />
              </Field>

              <Field label="Client ID">
                <TextInput name="clientId" value={formData.clientId} onChange={handleChange} placeholder="Enter client ID" />
              </Field>
            </div>

            {/* RIGHT COLUMN */}
            <div style={columnStyle}>
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

              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 9, cursor: 'pointer', alignSelf: 'flex-start' }}>
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  style={{ width: 16, height: 16, margin: 0, accentColor: '#7A1F2B', cursor: 'pointer' }}
                />
                <span style={{ ...labelStyle, marginBottom: 0 }}>Active</span>
              </label>

              <Field label="Headers (JSON)" required error={errors.headers}>
                <textarea
                  name="headers"
                  rows={5}
                  value={formData.headers}
                  onChange={handleChange}
                  style={{ ...jsonStyle, height: 150, color: '#E5C378' }}
                  {...focusHandlers(Boolean(errors.headers))}
                />
              </Field>

              <Field label="Request Template (JSON)" required error={errors.requestTemplate}>
                <textarea
                  name="requestTemplate"
                  rows={11}
                  value={formData.requestTemplate}
                  onChange={handleChange}
                  style={{ ...jsonStyle, height: 285, color: '#86efac' }}
                  {...focusHandlers(Boolean(errors.requestTemplate))}
                />
              </Field>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              flexWrap: 'wrap',
              paddingTop: 24,
              marginTop: 28,
              borderTop: '1px solid rgba(122,31,43,.1)',
            }}
          >
            <button
              type="button"
              onClick={() => navigate('/home/user-management/acquirers')}
              style={{ height: 42, padding: '0 22px', borderRadius: 9999, border: '1px solid rgba(122,31,43,.2)', background: '#fff', color: '#7A1F2B', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
            >
              Back
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <button
                type="submit"
                disabled={submitting}
                style={{ height: 42, padding: '0 26px', borderRadius: 9999, border: 0, background: submitting ? 'rgba(122,31,43,.45)' : 'linear-gradient(135deg,#7A1F2B 0%,#C99A3D 100%)', color: '#fff', fontWeight: 700, fontSize: 13, cursor: submitting ? 'not-allowed' : 'pointer' }}
              >
                {submitting ? 'Saving...' : isEdit ? 'Update' : 'Submit'}
              </button>
              <button
                type="button"
                onClick={handleClear}
                style={{ height: 42, padding: '0 22px', borderRadius: 9999, border: '1px solid rgba(201,154,61,.5)', background: '#FAF2E8', color: '#926A18', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
              >
                Clear
              </button>
            </div>
          </div>
        </form>
      </div>
    </PayVangLayout>
  );
}
