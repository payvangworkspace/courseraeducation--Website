import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PayVangLayout from '../components/layout/PayVangLayout';
import GradientButton from '../components/common/GradientButton';
import { ArrowLeft, CheckCircle2, AlertCircle, Building, Lock } from 'lucide-react';

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
    password: ''
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

    fetch('/api/merchants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        username: formData.username,
        businessName: formData.businessName,
        contactNumber: formData.phoneNumber,
        businessType: formData.businessType,
        subIndustry: formData.subIndustry,
        panSSN: formData.panSSN,
        gstVAT: formData.gstVAT,
        website: formData.website,
        password: formData.password
      })
    })
      .then((res) => {
        if (!res.ok) return res.json().then((err) => Promise.reject(err));
        return res.json();
      })
      .then((newMerchant) => {
        setSubmitting(false);
        setSuccessMsg(`Merchant "${newMerchant.name}" successfully created with ID ${newMerchant.id}! Redirecting...`);
        setTimeout(() => {
          navigate('/home/user-management/merchants');
        }, 1500);
      })
      .catch((err) => {
        setSubmitting(false);
        setErrors({ server: err.error || 'Failed to create merchant.' });
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
      password: ''
    });
    setErrors({});
    setSuccessMsg('');
  };

  return (
    <PayVangLayout title="Add Merchant Account" subtitle="Register new merchant entity, credential secrets, and business compliance profile.">
      <div className="coursera-card p-6 md:p-8 max-w-4xl mx-auto space-y-6">
        {/* HEADER BACK NAVIGATION */}
        <div className="flex items-center justify-between pb-4 border-b border-[#7A1F2B]/10">
          <button
            onClick={() => navigate('/home/user-management/merchants')}
            className="text-xs font-bold text-[#7A1F2B] hover:text-[#241417] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Merchants List
          </button>

          <span className="coursera-badge-maroon text-[11px]">KYC FORM V2.4</span>
        </div>

        {successMsg && (
          <div className="p-4 bg-[#16a34a]/10 border border-[#16a34a]/30 text-[#15803d] rounded-2xl flex items-center gap-3 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-[#16a34a]" />
            <span>{successMsg}</span>
          </div>
        )}

        {errors.server && (
          <div className="p-4 bg-[#dc2626]/10 border border-[#dc2626]/30 text-[#b91c1c] rounded-2xl flex items-center gap-3 text-sm font-semibold">
            <AlertCircle className="w-5 h-5 shrink-0 text-[#dc2626]" />
            <span>{errors.server}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Merchant Name */}
            <div>
              <label className="block text-xs font-bold text-[#7A1F2B] uppercase tracking-wider mb-1.5">
                Merchant Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Reliance Retail Ltd"
                className="w-full bg-[#FAF2E8] border border-[#7A1F2B]/15 text-[#241417] text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#7A1F2B] transition-colors"
              />
              {errors.name && <p className="text-xs text-red-600 mt-1 font-medium">{errors.name}</p>}
            </div>

            {/* Username / Email */}
            <div>
              <label className="block text-xs font-bold text-[#7A1F2B] uppercase tracking-wider mb-1.5">
                Username / Email *
              </label>
              <input
                type="email"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="e.g. admin@relianceretail.com"
                className="w-full bg-[#FAF2E8] border border-[#7A1F2B]/15 text-[#241417] text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#7A1F2B] transition-colors"
              />
              {errors.username && <p className="text-xs text-red-600 mt-1 font-medium">{errors.username}</p>}
            </div>

            {/* Business Name */}
            <div>
              <label className="block text-xs font-bold text-[#7A1F2B] uppercase tracking-wider mb-1.5">
                Business Name *
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="e.g. Reliance Retail Digital Pvt Ltd"
                className="w-full bg-[#FAF2E8] border border-[#7A1F2B]/15 text-[#241417] text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#7A1F2B] transition-colors"
              />
              {errors.businessName && <p className="text-xs text-red-600 mt-1 font-medium">{errors.businessName}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-[#7A1F2B] uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="e.g. +91 98200 11223"
                className="w-full bg-[#FAF2E8] border border-[#7A1F2B]/15 text-[#241417] text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#7A1F2B] transition-colors"
              />
            </div>

            {/* Business Type Dropdown */}
            <div>
              <label className="block text-xs font-bold text-[#7A1F2B] uppercase tracking-wider mb-1.5">
                Business Type
              </label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className="w-full bg-[#FAF2E8] border border-[#7A1F2B]/15 text-[#241417] text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#7A1F2B] transition-colors"
              >
                <option value="E-Commerce">E-Commerce</option>
                <option value="Logistics">Logistics</option>
                <option value="EdTech">EdTech</option>
                <option value="SaaS">SaaS</option>
                <option value="Retail">Retail</option>
                <option value="Travel">Travel & Hospitality</option>
              </select>
            </div>

            {/* Sub Industry Dropdown */}
            <div>
              <label className="block text-xs font-bold text-[#7A1F2B] uppercase tracking-wider mb-1.5">
                Sub Industry
              </label>
              <select
                name="subIndustry"
                value={formData.subIndustry}
                onChange={handleChange}
                className="w-full bg-[#FAF2E8] border border-[#7A1F2B]/15 text-[#241417] text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#7A1F2B] transition-colors"
              >
                <option value="Digital Goods">Digital Goods</option>
                <option value="Food Delivery">Food Delivery</option>
                <option value="Apparel">Apparel & Fashion</option>
                <option value="Electronics">Electronics</option>
                <option value="Booking Services">Booking & Ticketing</option>
              </select>
            </div>

            {/* PAN / SSN */}
            <div>
              <label className="block text-xs font-bold text-[#7A1F2B] uppercase tracking-wider mb-1.5">
                PAN / SSN Number
              </label>
              <input
                type="text"
                name="panSSN"
                value={formData.panSSN}
                onChange={handleChange}
                placeholder="e.g. ABCDE1234F"
                className="w-full bg-[#FAF2E8] border border-[#7A1F2B]/15 text-[#241417] text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#7A1F2B] transition-colors"
              />
            </div>

            {/* GST / VAT */}
            <div>
              <label className="block text-xs font-bold text-[#7A1F2B] uppercase tracking-wider mb-1.5">
                GST / VAT Number
              </label>
              <input
                type="text"
                name="gstVAT"
                value={formData.gstVAT}
                onChange={handleChange}
                placeholder="e.g. 27AAAAA0000A1Z5"
                className="w-full bg-[#FAF2E8] border border-[#7A1F2B]/15 text-[#241417] text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#7A1F2B] transition-colors"
              />
            </div>

            {/* Website */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#7A1F2B] uppercase tracking-wider mb-1.5">
                Business Website URL
              </label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="e.g. https://www.relianceretail.com"
                className="w-full bg-[#FAF2E8] border border-[#7A1F2B]/15 text-[#241417] text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#7A1F2B] transition-colors"
              />
            </div>

            {/* Password with Inline Validation Hints */}
            <div className="md:col-span-2 bg-[#FBF3E7] p-5 rounded-2xl border border-[#7A1F2B]/15 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#7A1F2B]">
                <Lock className="w-4 h-4 text-[#C99A3D]" />
                Merchant Initial Password Setup *
              </div>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password..."
                className="w-full bg-white border border-[#7A1F2B]/15 text-[#241417] text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#7A1F2B] transition-colors"
              />

              {/* Password Rule Validation Hints */}
              <div className="space-y-1.5 text-xs pt-1">
                <div className="flex items-center gap-2">
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${passValidation.hasUpper ? 'bg-green-600 text-white' : 'bg-amber-200 text-amber-800'}`}>
                    {passValidation.hasUpper ? '✓' : '•'}
                  </span>
                  <span className={passValidation.hasUpper ? 'text-green-700 font-semibold' : 'text-[#6b5a56]'}>
                    Must contain at least 1 uppercase letter (A-Z)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${passValidation.hasMinLength ? 'bg-green-600 text-white' : 'bg-amber-200 text-amber-800'}`}>
                    {passValidation.hasMinLength ? '✓' : '•'}
                  </span>
                  <span className={passValidation.hasMinLength ? 'text-green-700 font-semibold' : 'text-[#6b5a56]'}>
                    Must be at least 8 characters long
                  </span>
                </div>
              </div>
              {errors.password && <p className="text-xs text-red-600 font-medium">{errors.password}</p>}
            </div>
          </div>

          {/* BUTTON ACTIONS */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#7A1F2B]/10">
            <button
              type="button"
              onClick={() => navigate('/home/user-management/merchants')}
              className="px-5 py-2.5 rounded-full border border-[#7A1F2B]/20 text-[#7A1F2B] font-semibold text-sm hover:bg-[#FBF3E7] transition-colors cursor-pointer"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="px-5 py-2.5 rounded-full border border-[#9E8984] text-[#6b5a56] font-semibold text-sm hover:bg-[#FAF2E8] transition-colors cursor-pointer"
            >
              Clear Form
            </button>

            <GradientButton type="submit" className={submitting ? 'opacity-50 pointer-events-none' : ''}>
              {submitting ? 'Saving Merchant...' : 'Submit & Create Merchant'}
            </GradientButton>
          </div>
        </form>
      </div>
    </PayVangLayout>
  );
}
