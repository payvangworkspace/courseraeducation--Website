import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Download,
  Edit3,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import {
  acquirerApi,
  apiMasterApi,
  currencyApi,
  feeRuleApi,
  ipKeyApi,
  merchantApi,
  payoutApi,
  unwrapList,
} from '../api';

const ADMIN_OPTS = { includePayVangHeaders: false };
const IPV4 =
  /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

const buttonStyle = {
  height: 36,
  border: 'none',
  borderRadius: 10,
  padding: '0 16px',
  fontSize: 12.5,
  fontWeight: 800,
  cursor: 'pointer',
};

const fieldStyle = {
  width: '100%',
  height: 42,
  borderRadius: 10,
  border: '1px solid rgba(122,31,43,.18)',
  background: '#fffdf9',
  color: '#241417',
  padding: '0 12px',
  boxSizing: 'border-box',
  outline: 'none',
  font: 'inherit',
};

function rows(data) {
  const list = unwrapList(data);
  if (list.length) return list;
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== 'object') return [];
  for (const key of ['data', 'result', 'records', 'content', 'items']) {
    const value = data[key];
    if (Array.isArray(value)) return value;
  }
  return [];
}

function object(data) {
  if (!data || typeof data !== 'object') return {};
  if (Array.isArray(data)) return data[0] || {};
  const nested = data.data || data.result || data.details;
  return nested && typeof nested === 'object' && !Array.isArray(nested)
    ? { ...data, ...nested }
    : data;
}

function valueOf(row, ...keys) {
  for (const key of keys) {
    const value = row?.[key];
    if (value !== undefined && value !== null && String(value) !== '') return value;
  }
  return '—';
}

function formatDate(value) {
  if (!value || value === '—') return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function active(value) {
  if (typeof value === 'boolean') return value;
  return !['false', 'inactive', 'disabled', '0'].includes(String(value ?? true).toLowerCase());
}

function ActionButton({ children, onClick, title, danger = false, disabled = false }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 32,
        height: 32,
        borderRadius: 9,
        border: `1px solid ${danger ? 'rgba(220,38,38,.2)' : 'rgba(122,31,43,.16)'}`,
        background: danger ? 'rgba(220,38,38,.07)' : 'rgba(122,31,43,.07)',
        color: danger ? '#dc2626' : '#7A1F2B',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
      }}
    >
      {children}
    </button>
  );
}

function Section({ title, subtitle, onAdd, children }) {
  return (
    <section
      style={{
        border: '1px solid rgba(122,31,43,.11)',
        borderRadius: 16,
        overflow: 'hidden',
        background: '#fff',
      }}
    >
      <div
        style={{
          minHeight: 54,
          padding: '0 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          background: '#FBF6EE',
          borderBottom: '1px solid rgba(122,31,43,.09)',
        }}
      >
        <div>
          <h3 style={{ margin: 0, color: '#7A1F2B', fontSize: 15, fontWeight: 800 }}>{title}</h3>
          {subtitle ? <p style={{ margin: '2px 0 0', color: '#6b5a56', fontSize: 11.5 }}>{subtitle}</p> : null}
        </div>
        {onAdd ? (
          <ActionButton title={`Add ${title}`} onClick={onAdd}>
            <Plus size={16} />
          </ActionButton>
        ) : null}
      </div>
      <div style={{ padding: 18 }}>{children}</div>
    </section>
  );
}

function Empty({ children = 'Add details to view' }) {
  return (
    <div style={{ padding: '24px 12px', textAlign: 'center', color: '#9E8984', fontSize: 12.5 }}>
      {children}
    </div>
  );
}

function Loading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 30 }}>
      <RefreshCw className="animate-spin" size={24} color="#7A1F2B" />
    </div>
  );
}

function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <div style={{ padding: '10px 12px', marginBottom: 12, borderRadius: 10, background: '#FFF2F2', color: '#b91c1c', fontSize: 12.5 }}>
      {message}
    </div>
  );
}

function Table({ columns, data, rowKey = 'id' }) {
  if (!data.length) return <Empty />;
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{
                  padding: '10px 12px',
                  color: '#7A1F2B',
                  fontSize: 10.5,
                  textTransform: 'uppercase',
                  letterSpacing: '.04em',
                  borderBottom: '1px solid rgba(122,31,43,.1)',
                  whiteSpace: 'nowrap',
                }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row[rowKey] || index}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  style={{
                    padding: '12px',
                    color: '#241417',
                    fontSize: 12.5,
                    borderBottom: '1px solid rgba(122,31,43,.06)',
                    whiteSpace: column.nowrap ? 'nowrap' : undefined,
                  }}
                >
                  {column.render ? column.render(row) : valueOf(row, column.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Drawer({ title, merchantName, merchantId, open, onClose, children }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
      <button
        type="button"
        aria-label="Close drawer"
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, border: 0, background: 'rgba(36,20,23,.58)', cursor: 'default' }}
      />
      <aside
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(430px, 100vw)',
          background: '#fff',
          boxShadow: '-14px 0 40px rgba(36,20,23,.2)',
          overflowY: 'auto',
          padding: 28,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h2 style={{ margin: 0, color: '#7A1F2B', fontSize: 23, fontWeight: 800 }}>{title}</h2>
            <div style={{ marginTop: 14, fontSize: 12.5, color: '#241417' }}>
              <strong>Merchant Name:</strong> {merchantName}
              <br />
              <strong>ID:</strong> {merchantId}
            </div>
          </div>
          <ActionButton title="Close" onClick={onClose}>
            <X size={16} />
          </ActionButton>
        </div>
        <div style={{ marginTop: 24 }}>{children}</div>
      </aside>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label style={{ display: 'block', marginBottom: 14 }}>
      <span style={{ display: 'block', marginBottom: 6, color: '#7A1F2B', fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase' }}>
        {label} {required ? <span style={{ color: '#dc2626' }}>*</span> : null}
      </span>
      {children}
    </label>
  );
}

function DrawerActions({ saving, submitLabel = 'Add', onClose }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
      <button
        type="submit"
        disabled={saving}
        style={{ ...buttonStyle, background: '#16a34a', color: '#fff', opacity: saving ? 0.6 : 1 }}
      >
        {saving ? 'Saving…' : submitLabel}
      </button>
      <button type="button" onClick={onClose} style={{ ...buttonStyle, background: '#C99A3D', color: '#fff' }}>
        Close
      </button>
    </div>
  );
}

export function PayoutPanel({ userId, merchantName }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState([]);
  const [ips, setIps] = useState([]);
  const [keys, setKeys] = useState([]);
  const [acquirers, setAcquirers] = useState([]);
  const [drawer, setDrawer] = useState('');
  const [saving, setSaving] = useState(false);
  const [ip, setIp] = useState('');
  const [allowedIp, setAllowedIp] = useState('');
  const [tdr, setTdr] = useState({ acquirerId: '', minimumAmount: '', maximumAmount: '', acquirerProfile: '' });

  const load = async () => {
    setLoading(true);
    setError('');
    const [settingsRes, ipRes, keyRes, acquirerRes] = await Promise.allSettled([
      payoutApi.getPayoutSettings(userId, ADMIN_OPTS),
      payoutApi.getPayoutIPWhiteList(userId, ADMIN_OPTS),
      ipKeyApi.getMerchantIpKeyList(userId, ADMIN_OPTS),
      acquirerApi.getAllAcquirer({ start: 0, size: 200 }, ADMIN_OPTS),
    ]);
    if (settingsRes.status === 'fulfilled') {
      const list = rows(settingsRes.value);
      setSettings(list.length ? list : Object.keys(object(settingsRes.value)).length ? [object(settingsRes.value)] : []);
    }
    if (ipRes.status === 'fulfilled') setIps(rows(ipRes.value));
    if (keyRes.status === 'fulfilled') setKeys(rows(keyRes.value));
    if (acquirerRes.status === 'fulfilled') setAcquirers(rows(acquirerRes.value));
    if ([settingsRes, ipRes, keyRes].every((result) => result.status === 'rejected')) {
      setError(settingsRes.reason?.message || 'Unable to load payout settings.');
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = window.setTimeout(load, 0);
    return () => window.clearTimeout(timer);
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const addIp = async (event) => {
    event.preventDefault();
    if (!IPV4.test(ip)) return setError('Enter a valid IPv4 address.');
    setSaving(true);
    setError('');
    try {
      await payoutApi.addPayoutIPWhiteList(
        { user: { userId }, ipAddress: ip, systemName: 'Merchant dashboard', ipAddressDesc: 'Added by administrator', status: true },
        ADMIN_OPTS
      );
      setIp('');
      setDrawer('');
      await load();
    } catch (err) {
      setError(err.message || 'Unable to add IP address.');
    } finally {
      setSaving(false);
    }
  };

  const addKey = async (event) => {
    event.preventDefault();
    if (!IPV4.test(allowedIp)) return setError('Enter a valid IPv4 address.');
    setSaving(true);
    setError('');
    try {
      await ipKeyApi.createIPKey({ merchantId: userId, allowedIp }, ADMIN_OPTS);
      setAllowedIp('');
      setDrawer('');
      await load();
    } catch (err) {
      setError(err.message || 'Unable to create IP key.');
    } finally {
      setSaving(false);
    }
  };

  const addTdr = async (event) => {
    event.preventDefault();
    const acquirer = acquirers.find((item) => String(valueOf(item, 'userId', 'acquirerId', 'id')) === tdr.acquirerId);
    if (!tdr.acquirerId) return setError('Select an acquirer.');
    setSaving(true);
    setError('');
    try {
      await payoutApi.addPayoutSettings(
        {
          user: { userId },
          acquirer: acquirer || { userId: tdr.acquirerId },
          acquirerPriority: 1,
          acquirerProfilePriority: 1,
          minimumAmount: Number(tdr.minimumAmount || 0),
          maximumAmount: Number(tdr.maximumAmount || 0),
          acquirerProfile: tdr.acquirerProfile,
          status: true,
        },
        ADMIN_OPTS
      );
      setDrawer('');
      await load();
    } catch (err) {
      setError(err.message || 'Unable to add payout TDR setting.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <ErrorBox message={error} />
      <Section title="TDR Settings" subtitle="Payout acquirer routing and amount limits" onAdd={() => setDrawer('tdr')}>
        <Table
          rowKey="payoutSettingsId"
          data={settings}
          columns={[
            { key: 'acquirerProfile', label: 'Acquirer Profile' },
            { key: 'minimumAmount', label: 'Minimum Amount' },
            { key: 'maximumAmount', label: 'Maximum Amount' },
            { key: 'acquirerPriority', label: 'Priority' },
            { key: 'status', label: 'Status', render: (row) => (active(row.status) ? 'Active' : 'Inactive') },
          ]}
        />
      </Section>
      <Section title="IP Whitelist" onAdd={() => setDrawer('ip')}>
        <Table
          rowKey="payoutIpWhitelistId"
          data={ips}
          columns={[
            { key: 'ipAddress', label: 'IP Address' },
            { key: 'createdDate', label: 'Created Date', render: (row) => formatDate(row.createdDate) },
            {
              key: 'action',
              label: 'Action',
              render: (row) => (
                <ActionButton
                  danger
                  title="Remove IP"
                  onClick={async () => {
                    try {
                      await payoutApi.removePayoutIP(row, ADMIN_OPTS);
                      await load();
                    } catch (err) {
                      setError(err.message || 'Unable to remove IP address.');
                    }
                  }}
                >
                  <Trash2 size={14} />
                </ActionButton>
              ),
            },
          ]}
        />
      </Section>
      <Section title="IP Key" onAdd={() => setDrawer('key')}>
        <Table
          rowKey="id"
          data={keys}
          columns={[
            { key: 'allowedIp', label: 'Allowed IP Address', render: (row) => valueOf(row, 'allowedIp', 'ipAddress') },
            { key: 'createdDate', label: 'Created Date', render: (row) => formatDate(valueOf(row, 'createdDate', 'createdOn')) },
            { key: 'status', label: 'Status', render: (row) => (active(row.status) ? 'Active' : 'Inactive') },
          ]}
        />
      </Section>

      <Drawer title="Add Payout TDR Setting" merchantName={merchantName} merchantId={userId} open={drawer === 'tdr'} onClose={() => setDrawer('')}>
        <form onSubmit={addTdr}>
          <Field label="Acquirer" required>
            <select value={tdr.acquirerId} onChange={(e) => setTdr({ ...tdr, acquirerId: e.target.value })} style={fieldStyle}>
              <option value="">Select Acquirer</option>
              {acquirers.map((item, index) => {
                const id = String(valueOf(item, 'userId', 'acquirerId', 'id'));
                return <option key={id + index} value={id}>{valueOf(item, 'fullName', 'businessName', 'acquirerCode', 'userId')}</option>;
              })}
            </select>
          </Field>
          <Field label="Acquirer Profile">
            <input value={tdr.acquirerProfile} onChange={(e) => setTdr({ ...tdr, acquirerProfile: e.target.value })} style={fieldStyle} />
          </Field>
          <Field label="Minimum Amount">
            <input type="number" min="0" value={tdr.minimumAmount} onChange={(e) => setTdr({ ...tdr, minimumAmount: e.target.value })} style={fieldStyle} />
          </Field>
          <Field label="Maximum Amount">
            <input type="number" min="0" value={tdr.maximumAmount} onChange={(e) => setTdr({ ...tdr, maximumAmount: e.target.value })} style={fieldStyle} />
          </Field>
          <DrawerActions saving={saving} onClose={() => setDrawer('')} />
        </form>
      </Drawer>
      <Drawer title="Add IP Whitelist" merchantName={merchantName} merchantId={userId} open={drawer === 'ip'} onClose={() => setDrawer('')}>
        <form onSubmit={addIp}>
          <Field label="IP Address" required>
            <input value={ip} onChange={(e) => setIp(e.target.value.trim())} placeholder="Enter IP address (e.g. 192.168.1.2)" style={fieldStyle} />
          </Field>
          <DrawerActions saving={saving} onClose={() => setDrawer('')} />
        </form>
      </Drawer>
      <Drawer title="Add Allowed IP" merchantName={merchantName} merchantId={userId} open={drawer === 'key'} onClose={() => setDrawer('')}>
        <form onSubmit={addKey}>
          <Field label="Allowed IP Address" required>
            <input value={allowedIp} onChange={(e) => setAllowedIp(e.target.value.trim())} placeholder="Enter allowed IP address" style={fieldStyle} />
          </Field>
          <DrawerActions saving={saving} onClose={() => setDrawer('')} />
        </form>
      </Drawer>
    </div>
  );
}

export function DocumentsPanel({ userId, merchantName }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [drawer, setDrawer] = useState(false);
  const [type, setType] = useState('');
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setData(rows(await merchantApi.getUsersDocuments(userId, ADMIN_OPTS)));
    } catch (err) {
      setError(err.message || 'Unable to load documents.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const timer = window.setTimeout(load, 0);
    return () => window.clearTimeout(timer);
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const upload = async (event) => {
    event.preventDefault();
    if (!type || !file) return setError('Document type and file are required.');
    setSaving(true);
    try {
      await merchantApi.uploadDocument(file, { documentType: type, userId }, ADMIN_OPTS);
      setDrawer(false);
      setType('');
      setFile(null);
      await load();
    } catch (err) {
      setError(err.message || 'Unable to upload document.');
    } finally {
      setSaving(false);
    }
  };

  const download = async (row) => {
    try {
      const result = await merchantApi.getDocumentsFile(valueOf(row, 'documentId', 'id'), ADMIN_OPTS);
      const blob = result instanceof Blob ? result : new Blob([typeof result === 'string' ? result : JSON.stringify(result)]);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = String(valueOf(row, 'fileName', 'name', 'documentName')).replace('—', 'document');
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'Unable to download document.');
    }
  };

  if (loading) return <Loading />;
  return (
    <>
      <ErrorBox message={error} />
      <Section title="Merchant Documents" onAdd={() => setDrawer(true)}>
        <Table
          rowKey="documentId"
          data={data}
          columns={[
            { key: 'name', label: 'Document Name', render: (row) => valueOf(row, 'documentName', 'name', 'documentType') },
            { key: 'fileName', label: 'File', render: (row) => valueOf(row, 'fileName', 'file', 'name') },
            { key: 'status', label: 'Status' },
            {
              key: 'actions',
              label: 'Actions',
              render: (row) => (
                <div style={{ display: 'flex', gap: 7 }}>
                  <ActionButton title="Download" onClick={() => download(row)}><Download size={14} /></ActionButton>
                  <ActionButton
                    title="Verify"
                    onClick={async () => {
                      try {
                        await merchantApi.verifyDocument(valueOf(row, 'documentId', 'id'), ADMIN_OPTS);
                        await load();
                      } catch (err) {
                        setError(err.message || 'Unable to verify document.');
                      }
                    }}
                  >
                    <CheckCircle2 size={14} />
                  </ActionButton>
                </div>
              ),
            },
          ]}
        />
      </Section>
      <Drawer title="Upload Document" merchantName={merchantName} merchantId={userId} open={drawer} onClose={() => setDrawer(false)}>
        <form onSubmit={upload}>
          <Field label="Document Type" required>
            <input value={type} onChange={(e) => setType(e.target.value)} placeholder="e.g. PAN Card" style={fieldStyle} />
          </Field>
          <Field label="File" required>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} style={{ ...fieldStyle, paddingTop: 8 }} />
          </Field>
          <DrawerActions saving={saving} onClose={() => setDrawer(false)} />
        </form>
      </Drawer>
    </>
  );
}

export function CurrencyPanel({ userId, merchantName }) {
  const [mapped, setMapped] = useState([]);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [drawer, setDrawer] = useState(false);
  const [selected, setSelected] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [mappingRes, allRes] = await Promise.allSettled([
      currencyApi.getCurrencyMapping(userId, ADMIN_OPTS),
      currencyApi.getAllCurrencies({ start: 0, size: 500 }, ADMIN_OPTS),
    ]);
    const currencies = allRes.status === 'fulfilled' ? rows(allRes.value) : [];
    setAll(currencies);
    if (mappingRes.status === 'fulfilled') {
      const direct = rows(mappingRes.value);
      const codes = Array.isArray(mappingRes.value?.currencies)
        ? mappingRes.value.currencies
        : Array.isArray(mappingRes.value?.data?.currencies)
        ? mappingRes.value.data.currencies
        : [];
      setMapped(
        direct.length
          ? direct
          : codes.map((currency) =>
              typeof currency === 'string'
                ? currencies.find((item) => item.currencyCode === currency) || {
                    currencyId: currency,
                    currencyCode: currency,
                    currencyName: currency,
                  }
                : currency
            )
      );
    } else {
      setError(mappingRes.reason?.message || 'Unable to load currency mappings.');
    }
    setLoading(false);
  };
  useEffect(() => {
    const timer = window.setTimeout(load, 0);
    return () => window.clearTimeout(timer);
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const codes = useMemo(() => mapped.map((item) => String(valueOf(item, 'currencyCode', 'code'))).filter((code) => code !== '—'), [mapped]);
  const add = async (event) => {
    event.preventDefault();
    if (!selected) return;
    setSaving(true);
    try {
      await currencyApi.addCurrencyMapping({ userId, currencies: [...new Set([...codes, selected])] }, ADMIN_OPTS);
      setDrawer(false);
      setSelected('');
      await load();
    } catch (err) {
      setError(err.message || 'Unable to map currency.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  return (
    <>
      <ErrorBox message={error} />
      <Section title="Currency Mapping" onAdd={() => setDrawer(true)}>
        <Table
          rowKey="currencyId"
          data={mapped}
          columns={[
            { key: 'currencyName', label: 'Currency Name', render: (row) => valueOf(row, 'currencyName', 'name') },
            { key: 'currencyCode', label: 'Currency Code' },
            { key: 'symbol', label: 'Currency Symbol' },
            { key: 'currencyDecimalPlace', label: 'Decimal Places' },
            {
              key: 'action',
              label: 'Action',
              render: (row) => (
                <ActionButton
                  danger
                  title="Remove currency"
                  onClick={async () => {
                    try {
                      await currencyApi.removeCurrencyMapping(userId, valueOf(row, 'currencyId', 'currencyCode'), ADMIN_OPTS);
                      await load();
                    } catch (err) {
                      setError(err.message || 'Unable to remove currency.');
                    }
                  }}
                >
                  <Trash2 size={14} />
                </ActionButton>
              ),
            },
          ]}
        />
      </Section>
      <Drawer title="Add Currency Mapping" merchantName={merchantName} merchantId={userId} open={drawer} onClose={() => setDrawer(false)}>
        <form onSubmit={add}>
          <Field label="Currency" required>
            <select value={selected} onChange={(e) => setSelected(e.target.value)} style={fieldStyle}>
              <option value="">Select currency</option>
              {all.filter((item) => !codes.includes(item.currencyCode)).map((item) => (
                <option key={item.currencyId || item.currencyCode} value={item.currencyCode}>
                  {item.currencyName} ({item.currencyCode})
                </option>
              ))}
            </select>
          </Field>
          <DrawerActions saving={saving} onClose={() => setDrawer(false)} />
        </form>
      </Drawer>
    </>
  );
}

const EMPTY_FEE = { txnType: '', feeType: '', feeValue: '', capMin: '', capMax: '', commissionPercent: '', active: true };
const EMPTY_LIMIT = { txnType: '', perTxnMin: '', perTxnMax: '', dailyLimit: '', monthlyLimit: '', active: true };

export function FeesPanel({ userId, merchantName }) {
  const [fees, setFees] = useState([]);
  const [limits, setLimits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [drawer, setDrawer] = useState('');
  const [editing, setEditing] = useState(false);
  const [fee, setFee] = useState(EMPTY_FEE);
  const [limit, setLimit] = useState(EMPTY_LIMIT);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [feeRes, limitRes] = await Promise.allSettled([
      feeRuleApi.getMerchantFeeRule(userId, ADMIN_OPTS),
      feeRuleApi.getMerchantLimitRule(userId, ADMIN_OPTS),
    ]);
    if (feeRes.status === 'fulfilled') setFees(rows(feeRes.value));
    if (limitRes.status === 'fulfilled') setLimits(rows(limitRes.value));
    if (feeRes.status === 'rejected' && limitRes.status === 'rejected') setError(feeRes.reason?.message || 'Unable to load rules.');
    setLoading(false);
  };
  useEffect(() => {
    const timer = window.setTimeout(load, 0);
    return () => window.clearTimeout(timer);
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveFee = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...fee,
        merchantId: userId,
        feeValue: Number(fee.feeValue || 0),
        capMin: Number(fee.capMin || 0),
        capMax: Number(fee.capMax || 0),
        commissionPercent: Number(fee.commissionPercent || 0),
      };
      await (editing ? feeRuleApi.updateMerchantFeeRule(payload, ADMIN_OPTS) : feeRuleApi.addMerchantFeeRule(payload, ADMIN_OPTS));
      setDrawer('');
      setFee(EMPTY_FEE);
      setEditing(false);
      await load();
    } catch (err) {
      setError(err.message || 'Unable to save fee rule.');
    } finally {
      setSaving(false);
    }
  };

  const saveLimit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = { ...limit, merchantId: userId };
      await (editing ? feeRuleApi.updateMerchantLimitRule(payload, ADMIN_OPTS) : feeRuleApi.addMerchantLimitRule(payload, ADMIN_OPTS));
      setDrawer('');
      setLimit(EMPTY_LIMIT);
      setEditing(false);
      await load();
    } catch (err) {
      setError(err.message || 'Unable to save limit rule.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <ErrorBox message={error} />
      <Section title="Fees Setting" onAdd={() => { setEditing(false); setFee(EMPTY_FEE); setDrawer('fee'); }}>
        <Table
          rowKey="ruleId"
          data={fees}
          columns={[
            { key: 'txnType', label: 'Transaction Type' },
            { key: 'capMin', label: 'Per Txn (Minimum)' },
            { key: 'capMax', label: 'Per Txn (Maximum)' },
            { key: 'feeType', label: 'Fees Type' },
            { key: 'feeValue', label: 'Fees Value' },
            { key: 'commissionPercent', label: 'Commission %' },
            { key: 'active', label: 'Status', render: (row) => (active(row.active) ? 'Active' : 'Inactive') },
            {
              key: 'action',
              label: 'Action',
              render: (row) => (
                <ActionButton title="Edit fee" onClick={() => { setFee({ ...EMPTY_FEE, ...row }); setEditing(true); setDrawer('fee'); }}>
                  <Edit3 size={14} />
                </ActionButton>
              ),
            },
          ]}
        />
      </Section>
      <Section title="Limit Setting" onAdd={() => { setEditing(false); setLimit(EMPTY_LIMIT); setDrawer('limit'); }}>
        <Table
          rowKey="id"
          data={limits}
          columns={[
            { key: 'txnType', label: 'Transaction Type' },
            { key: 'perTxnMin', label: 'Per Txn (Minimum)' },
            { key: 'perTxnMax', label: 'Per Txn (Maximum)' },
            { key: 'dailyLimit', label: 'Daily Limit' },
            { key: 'monthlyLimit', label: 'Monthly Limit' },
            { key: 'active', label: 'Status', render: (row) => (active(row.active) ? 'Active' : 'Inactive') },
            {
              key: 'action',
              label: 'Action',
              render: (row) => (
                <ActionButton title="Edit limit" onClick={() => { setLimit({ ...EMPTY_LIMIT, ...row }); setEditing(true); setDrawer('limit'); }}>
                  <Edit3 size={14} />
                </ActionButton>
              ),
            },
          ]}
        />
      </Section>
      <Drawer title={`${editing ? 'Edit' : 'Add'} Fees Setting`} merchantName={merchantName} merchantId={userId} open={drawer === 'fee'} onClose={() => setDrawer('')}>
        <form onSubmit={saveFee}>
          <RuleSelect label="Txn Type" value={fee.txnType} onChange={(value) => setFee({ ...fee, txnType: value })} options={['PAYIN', 'PAYOUT', 'REFUND', 'ADJUSTMENT']} />
          <RuleSelect label="Fees Type" value={fee.feeType} onChange={(value) => setFee({ ...fee, feeType: value })} options={['FLAT', 'PERCENT', 'MIXED']} />
          {[
            ['Fee Value', 'feeValue'],
            ['Minimum Amount Limit', 'capMin'],
            ['Maximum Amount Limit', 'capMax'],
            ['Commission Percentage', 'commissionPercent'],
          ].map(([label, key]) => (
            <Field key={key} label={label} required>
              <input type="number" min="0" step="any" value={fee[key]} onChange={(e) => setFee({ ...fee, [key]: e.target.value })} style={fieldStyle} required />
            </Field>
          ))}
          <DrawerActions saving={saving} submitLabel={editing ? 'Update' : 'Add'} onClose={() => setDrawer('')} />
        </form>
      </Drawer>
      <Drawer title={`${editing ? 'Edit' : 'Add'} Limit Setting`} merchantName={merchantName} merchantId={userId} open={drawer === 'limit'} onClose={() => setDrawer('')}>
        <form onSubmit={saveLimit}>
          <RuleSelect label="Txn Type" value={limit.txnType} onChange={(value) => setLimit({ ...limit, txnType: value })} options={['PAYIN', 'PAYOUT', 'REFUND', 'ADJUSTMENT']} />
          {[
            ['Minimum TXN', 'perTxnMin'],
            ['Maximum TXN', 'perTxnMax'],
            ['Daily Limit', 'dailyLimit'],
            ['Monthly Limit', 'monthlyLimit'],
          ].map(([label, key]) => (
            <Field key={key} label={label} required>
              <input type="number" min="0" value={limit[key]} onChange={(e) => setLimit({ ...limit, [key]: e.target.value })} style={fieldStyle} required />
            </Field>
          ))}
          <DrawerActions saving={saving} submitLabel={editing ? 'Update' : 'Add'} onClose={() => setDrawer('')} />
        </form>
      </Drawer>
    </div>
  );
}

function RuleSelect({ label, value, onChange, options }) {
  return (
    <Field label={label} required>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={fieldStyle} required>
        <option value="">Select {label}</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </Field>
  );
}

const EMPTY_MAPPING = { aggregatorCode: '', priority: 1, environment: 'UAT', txnType: '', aliasName: '', active: true };

export function AggregatorPanel({ userId, merchantName }) {
  const [data, setData] = useState([]);
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [drawer, setDrawer] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(EMPTY_MAPPING);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [mappingRes, codeRes, apiRes] = await Promise.allSettled([
      apiMasterApi.getMerchantAggregatorMapping(userId, ADMIN_OPTS),
      apiMasterApi.getAcquirerCodes(ADMIN_OPTS),
      apiMasterApi.getAllApi(ADMIN_OPTS),
    ]);
    if (mappingRes.status === 'fulfilled') setData(rows(mappingRes.value));
    else setError(mappingRes.reason?.message || 'Unable to load aggregator mappings.');
    const codeRows = codeRes.status === 'fulfilled' ? rows(codeRes.value) : [];
    const apiRows = apiRes.status === 'fulfilled' ? rows(apiRes.value) : [];
    const rawCodes = codeRows.length
      ? codeRows.map((item) => typeof item === 'string' ? item : valueOf(item, 'aggregatorCode', 'acquirerCode', 'code'))
      : apiRows.map((item) => valueOf(item, 'aggregatorCode'));
    setCodes([...new Set(rawCodes.filter((code) => code !== '—'))]);
    setLoading(false);
  };
  useEffect(() => {
    const timer = window.setTimeout(load, 0);
    return () => window.clearTimeout(timer);
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, merchantId: userId, priority: Number(form.priority) };
      await (editing
        ? apiMasterApi.updateMerchantAggregatorMapping(payload, ADMIN_OPTS)
        : apiMasterApi.saveMerchantAggregatorMapping(payload, ADMIN_OPTS));
      setDrawer(false);
      setForm(EMPTY_MAPPING);
      setEditing(false);
      await load();
    } catch (err) {
      setError(err.message || 'Unable to save aggregator mapping.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  return (
    <>
      <ErrorBox message={error} />
      <Section title="Aggregator APIs" onAdd={() => { setEditing(false); setForm(EMPTY_MAPPING); setDrawer(true); }}>
        <Table
          rowKey="id"
          data={data}
          columns={[
            { key: 'aggregatorCode', label: 'Aggregator Code' },
            { key: 'aliasName', label: 'Alias Name' },
            { key: 'priority', label: 'Priority' },
            { key: 'environment', label: 'Environment' },
            { key: 'txnType', label: 'Txn Type' },
            { key: 'active', label: 'Status', render: (row) => (active(row.active) ? 'Active' : 'Inactive') },
            { key: 'createdOn', label: 'Created On', render: (row) => formatDate(row.createdOn) },
            {
              key: 'action',
              label: 'Action',
              render: (row) => (
                <ActionButton title="Edit mapping" onClick={() => { setForm({ ...EMPTY_MAPPING, ...row }); setEditing(true); setDrawer(true); }}>
                  <Edit3 size={14} />
                </ActionButton>
              ),
            },
          ]}
        />
      </Section>
      <Drawer title={`${editing ? 'Edit' : 'Add'} Merchant Aggregator Mapping`} merchantName={merchantName} merchantId={userId} open={drawer} onClose={() => setDrawer(false)}>
        <form onSubmit={save}>
          <Field label="Aggregator Code" required>
            {editing ? (
              <input value={form.aggregatorCode} disabled style={{ ...fieldStyle, background: '#F1ECE6' }} />
            ) : (
              <select value={form.aggregatorCode} onChange={(e) => setForm({ ...form, aggregatorCode: e.target.value })} style={fieldStyle} required>
                <option value="">Select aggregator code</option>
                {codes.map((code) => <option key={code} value={code}>{code}</option>)}
              </select>
            )}
          </Field>
          <Field label="Select Priority" required>
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} style={fieldStyle}>
              {[1, 2, 3, 4, 5].map((priority) => <option key={priority} value={priority}>{priority}</option>)}
            </select>
          </Field>
          <RuleSelect label="Environment" value={form.environment} onChange={(value) => setForm({ ...form, environment: value })} options={['UAT', 'PROD', 'SANDBOX']} />
          <RuleSelect label="Txn Type" value={form.txnType} onChange={(value) => setForm({ ...form, txnType: value })} options={['PAYIN', 'PAYOUT', 'REFUND', 'ADJUSTMENT']} />
          <Field label="Alias Name" required>
            <input value={form.aliasName} onChange={(e) => setForm({ ...form, aliasName: e.target.value })} style={fieldStyle} required />
          </Field>
          <label style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 12, fontWeight: 800, color: '#7A1F2B' }}>
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            ACTIVE
          </label>
          <DrawerActions saving={saving} submitLabel={editing ? 'Update' : 'Add'} onClose={() => setDrawer(false)} />
        </form>
      </Drawer>
    </>
  );
}

export function WebhooksPanel({ userId, merchantName, merchant, onUpdated }) {
  const [drawer, setDrawer] = useState('');
  const [url, setUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const open = (type) => {
    setDrawer(type);
    setUrl(type === 'payin' ? merchant.payinWebhookUrl || '' : merchant.payoutWebhookUrl || '');
  };
  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const field = drawer === 'payin' ? 'payinWebhookUrl' : 'payoutWebhookUrl';
      await merchantApi.updateDetails({ userId, [field]: url }, ADMIN_OPTS);
      setDrawer('');
      await onUpdated?.();
    } catch (err) {
      setError(err.message || 'Unable to save webhook URL.');
    } finally {
      setSaving(false);
    }
  };
  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <ErrorBox message={error} />
      <Section title="Payin Webhook" onAdd={() => open('payin')}>
        <div style={{ fontSize: 13, color: '#241417', wordBreak: 'break-all' }}>{merchant.payinWebhookUrl || <Empty />}</div>
      </Section>
      <Section title="Payout Webhook" onAdd={() => open('payout')}>
        <div style={{ fontSize: 13, color: '#241417', wordBreak: 'break-all' }}>{merchant.payoutWebhookUrl || <Empty />}</div>
      </Section>
      <Drawer title={`Add ${drawer === 'payin' ? 'Payin' : 'Payout'} Webhook`} merchantName={merchantName} merchantId={userId} open={Boolean(drawer)} onClose={() => setDrawer('')}>
        <form onSubmit={save}>
          <Field label={`${drawer} webhook URL`} required>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/webhook" style={fieldStyle} required />
          </Field>
          <DrawerActions saving={saving} submitLabel={url ? 'Save' : 'Add'} onClose={() => setDrawer('')} />
        </form>
      </Drawer>
    </div>
  );
}

export function SwaggerGap({ title, children }) {
  return (
    <Section title={title}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 8 }}>
        <ShieldCheck size={20} color="#C99A3D" />
        <p style={{ margin: 0, color: '#6b5a56', fontSize: 12.5, lineHeight: 1.55 }}>{children}</p>
      </div>
    </Section>
  );
}
