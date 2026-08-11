import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PayVangLayout from '../components/layout/PayVangLayout';
import { ArrowLeft, CheckCircle2, AlertCircle, Building2, Lock, FileText } from 'lucide-react';
import { merchantApi } from '../api';

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
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
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

const selectStyle = {
  ...fieldStyle,
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237A1F2B' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 14px center',
  paddingRight: '40px',
  cursor: 'pointer',
};

function Field({ label, required, error, children, className = '' }) {
  return (
    <div className={className} style={{ minWidth: 0 }}>
      <label style={labelStyle}>
        {label}
        {required ? <span style={{ color: '#C99A3D', marginLeft: 4 }}>*</span> : null}
      </label>
      {children}
      {error ? (
        <p style={{ margin: '6px 0 0', fontSize: '12px', fontWeight: 600, color: '#b91c1c' }}>{error}</p>
      ) : null}
    </div>
  );
}

function SectionHeader({ icon, iconBg, iconColor, title, subtitle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: '12px',
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
      <div>
        <h3
          style={{
            margin: 0,
            fontSize: '17px',
            fontWeight: 800,
            color: '#7A1F2B',
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {title}
        </h3>
        <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#6b5a56' }}>{subtitle}</p>
      </div>
    </div>
  );
}

function themedFocusHandlers(hasError) {
  return {
    onFocus: (e) => {
      e.target.style.borderColor = hasError ? '#dc2626' : '#7A1F2B';
      e.target.style.boxShadow = hasError
        ? '0 0 0 3px rgba(220, 38, 38, 0.12)'
        : '0 0 0 3px rgba(122, 31, 43, 0.14)';
      e.target.style.backgroundColor = '#fffdf9';
    },
    onBlur: (e) => {
      e.target.style.borderColor = hasError ? 'rgba(220, 38, 38, 0.45)' : 'rgba(122, 31, 43, 0.15)';
      e.target.style.boxShadow = 'none';
      e.target.style.backgroundColor = '#FAF2E8';
    },
  };
}

export default function AddMerchantPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    businessName: '',
    phoneNumber: '',
    businessType: 'E-Commerce',
    subIndustry: 'Digital Goods',
    panSSN: '',
    gstVAT: '',
    website: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validatePassword = (pass) => {
    const hasUpper = /[A-Z]/.test(pass);
    const hasMinLength = pass.length >= 8;
    return { hasUpper, hasMinLength, isValid: hasUpper && hasMinLength };
  };

  const passValidation = validatePassword(formData.password);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Merchant Name is required';
    if (!formData.username.trim()) newErrors.username = 'Username / Email is required';
    if (!formData.businessName.trim()) newErrors.businessName = 'Business Name is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passValidation.isValid) {
      newErrors.password = 'Password does not meet required security criteria';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    merchantApi
      .createUserViaAdmin(
        {
          userId: formData.username.trim(),
          fullName: formData.name.trim(),
          contactNumber: formData.phoneNumber.trim(),
          password: formData.password,
          businessName: formData.businessName.trim(),
          businessType: formData.businessType,
          subIndustry: formData.subIndustry,
          panSSN: formData.panSSN.trim(),
          gstVAT: formData.gstVAT.trim(),
          website: formData.website.trim(),
        },
        // Swagger: Bearer auth only — do not send ZIPAPIKEY / PayVang headers
        { includePayVangHeaders: false }
      )
      .then((newMerchant) => {
        setSubmitting(false);
        const displayName = newMerchant?.fullName || newMerchant?.name || formData.name;
        const displayId = newMerchant?.userId || newMerchant?.id || formData.username;
        setSuccessMsg(`Merchant "${displayName}" successfully created with ID ${displayId}! Redirecting...`);
        setTimeout(() => {
          navigate('/home/user-management/merchants');
        }, 1500);
      })
      .catch((err) => {
        setSubmitting(false);
        setErrors({ server: err.message || err.data?.message || err.error || 'Failed to create merchant.' });
      });
  };

  const handleClear = () => {
    setFormData({
      name: '',
      username: '',
      businessName: '',
      phoneNumber: '',
      businessType: 'E-Commerce',
      subIndustry: 'Digital Goods',
      panSSN: '',
      gstVAT: '',
      website: '',
      password: '',
    });
    setErrors({});
    setSuccessMsg('');
  };

  const inputStyle = (hasError) => ({
    ...fieldStyle,
    borderColor: hasError ? 'rgba(220, 38, 38, 0.45)' : 'rgba(122, 31, 43, 0.15)',
  });

  return (
    <PayVangLayout
      title="Add Merchant Account"
      subtitle="Register new merchant entity, credential secrets, and business compliance profile."
    >
      <div
        style={{
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '28px 32px 32px',
          border: '1px solid rgba(122, 31, 43, 0.12)',
          boxShadow: '0 4px 20px rgba(122, 31, 43, 0.04)',
          boxSizing: 'border-box',
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            paddingBottom: '18px',
            marginBottom: '24px',
            borderBottom: '1px solid rgba(122, 31, 43, 0.1)',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            onClick={() => navigate('/home/user-management/merchants')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              color: '#7A1F2B',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <ArrowLeft style={{ width: 16, height: 16 }} />
            Back to Merchants List
          </button>

          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.04em',
              color: '#7A1F2B',
              backgroundColor: 'rgba(122, 31, 43, 0.08)',
              border: '1px solid rgba(122, 31, 43, 0.15)',
              padding: '6px 12px',
              borderRadius: '9999px',
            }}
          >
            KYC FORM V2.4
          </span>
        </div>

        {successMsg && (
          <div
            style={{
              padding: '14px 16px',
              marginBottom: '20px',
              backgroundColor: 'rgba(22, 163, 74, 0.08)',
              border: '1px solid rgba(22, 163, 74, 0.28)',
              color: '#15803d',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            <CheckCircle2 style={{ width: 18, height: 18, flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {errors.server && (
          <div
            style={{
              padding: '14px 16px',
              marginBottom: '20px',
              backgroundColor: 'rgba(220, 38, 38, 0.08)',
              border: '1px solid rgba(220, 38, 38, 0.28)',
              color: '#b91c1c',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            <AlertCircle style={{ width: 18, height: 18, flexShrink: 0 }} />
            <span>{errors.server}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* BUSINESS PROFILE — 3 columns on large screens */}
          <div style={{ marginBottom: '28px' }}>
            <SectionHeader
              icon={<Building2 style={{ width: 18, height: 18 }} />}
              iconBg="rgba(122, 31, 43, 0.08)"
              iconColor="#7A1F2B"
              title="Business Profile"
              subtitle="Merchant identity and account credentials"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-5">
              <Field label="Merchant Name" required error={errors.name}>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Reliance Retail Ltd"
                  style={inputStyle(!!errors.name)}
                  {...themedFocusHandlers(!!errors.name)}
                />
              </Field>

              <Field label="Username / Email" required error={errors.username}>
                <input
                  type="email"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="e.g. admin@relianceretail.com"
                  style={inputStyle(!!errors.username)}
                  {...themedFocusHandlers(!!errors.username)}
                />
              </Field>

              <Field label="Business Name" required error={errors.businessName}>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="e.g. Reliance Retail Digital Pvt Ltd"
                  style={inputStyle(!!errors.businessName)}
                  {...themedFocusHandlers(!!errors.businessName)}
                />
              </Field>

              <Field label="Phone Number">
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="e.g. +91 98200 11223"
                  style={inputStyle(false)}
                  {...themedFocusHandlers(false)}
                />
              </Field>

              <Field label="Business Type">
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  style={selectStyle}
                  {...themedFocusHandlers(false)}
                >
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Logistics">Logistics</option>
                  <option value="EdTech">EdTech</option>
                  <option value="SaaS">SaaS</option>
                  <option value="Retail">Retail</option>
                  <option value="Travel">Travel & Hospitality</option>
                </select>
              </Field>

              <Field label="Sub Industry">
                <select
                  name="subIndustry"
                  value={formData.subIndustry}
                  onChange={handleChange}
                  style={selectStyle}
                  {...themedFocusHandlers(false)}
                >
                  <option value="Digital Goods">Digital Goods</option>
                  <option value="Food Delivery">Food Delivery</option>
                  <option value="Apparel">Apparel & Fashion</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Booking Services">Booking & Ticketing</option>
                </select>
              </Field>
            </div>
          </div>

          {/* COMPLIANCE + PASSWORD side by side */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-7">
            <div
              className="xl:col-span-3"
              style={{
                backgroundColor: '#FFFCFA',
                border: '1px solid rgba(122, 31, 43, 0.1)',
                borderRadius: '18px',
                padding: '22px 24px',
              }}
            >
              <SectionHeader
                icon={<FileText style={{ width: 18, height: 18 }} />}
                iconBg="rgba(201, 154, 61, 0.12)"
                iconColor="#C99A3D"
                title="Compliance Details"
                subtitle="Tax identifiers and public business presence"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
                <Field label="PAN / SSN Number">
                  <input
                    type="text"
                    name="panSSN"
                    value={formData.panSSN}
                    onChange={handleChange}
                    placeholder="e.g. ABCDE1234F"
                    style={inputStyle(false)}
                    {...themedFocusHandlers(false)}
                  />
                </Field>

                <Field label="GST / VAT Number">
                  <input
                    type="text"
                    name="gstVAT"
                    value={formData.gstVAT}
                    onChange={handleChange}
                    placeholder="e.g. 27AAAAA0000A1Z5"
                    style={inputStyle(false)}
                    {...themedFocusHandlers(false)}
                  />
                </Field>

                <Field label="Business Website URL" className="sm:col-span-2">
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="e.g. https://www.relianceretail.com"
                    style={inputStyle(false)}
                    {...themedFocusHandlers(false)}
                  />
                </Field>
              </div>
            </div>

            <div
              className="xl:col-span-2"
              style={{
                backgroundColor: '#FBF3E7',
                border: '1px solid rgba(122, 31, 43, 0.12)',
                borderRadius: '18px',
                padding: '22px 24px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Lock style={{ width: 16, height: 16, color: '#C99A3D' }} />
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#7A1F2B' }}>
                  Initial Password Setup
                  <span style={{ color: '#C99A3D', marginLeft: 4 }}>*</span>
                </span>
              </div>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter a secure password..."
                style={{
                  ...inputStyle(!!errors.password),
                  backgroundColor: '#ffffff',
                  marginBottom: '14px',
                }}
                {...themedFocusHandlers(!!errors.password)}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
                {[
                  { ok: passValidation.hasUpper, text: 'At least 1 uppercase letter (A–Z)' },
                  { ok: passValidation.hasMinLength, text: 'At least 8 characters long' },
                ].map((rule) => (
                  <div key={rule.text} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: '9999px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 800,
                        backgroundColor: rule.ok ? 'rgba(22, 163, 74, 0.15)' : 'rgba(201, 154, 61, 0.2)',
                        color: rule.ok ? '#15803d' : '#926A18',
                        flexShrink: 0,
                      }}
                    >
                      {rule.ok ? '✓' : '•'}
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: rule.ok ? 700 : 500,
                        color: rule.ok ? '#15803d' : '#6b5a56',
                      }}
                    >
                      {rule.text}
                    </span>
                  </div>
                ))}
              </div>
              {errors.password ? (
                <p style={{ margin: '12px 0 0', fontSize: '12px', fontWeight: 600, color: '#b91c1c' }}>
                  {errors.password}
                </p>
              ) : null}
            </div>
          </div>

          {/* ACTIONS */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '10px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(122, 31, 43, 0.1)',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              onClick={() => navigate('/home/user-management/merchants')}
              style={{
                height: '42px',
                padding: '0 20px',
                borderRadius: '9999px',
                border: '1px solid rgba(122, 31, 43, 0.2)',
                backgroundColor: '#ffffff',
                color: '#7A1F2B',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleClear}
              style={{
                height: '42px',
                padding: '0 20px',
                borderRadius: '9999px',
                border: '1px solid rgba(158, 137, 132, 0.45)',
                backgroundColor: '#FAF2E8',
                color: '#6b5a56',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Clear Form
            </button>

            <button
              type="submit"
              disabled={submitting}
              style={{
                height: '42px',
                padding: '0 24px',
                borderRadius: '9999px',
                border: 'none',
                background: submitting
                  ? 'rgba(122, 31, 43, 0.45)'
                  : 'linear-gradient(135deg, #7A1F2B 0%, #C99A3D 100%)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '13px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: submitting ? 'none' : '0 4px 12px rgba(122, 31, 43, 0.22)',
              }}
            >
              {submitting ? 'Saving Merchant...' : 'Submit & Create Merchant'}
            </button>
          </div>
        </form>
      </div>
    </PayVangLayout>
  );
}
