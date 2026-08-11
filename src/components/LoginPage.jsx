import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import ContactModal from "./ContactModel";
import CryptoJS from "crypto-js";
import { encryptRequestData, decryptResponse } from "../utils/encryptdecryptdata";
import { authApi } from "../api/auth";
import { saveAuthToken } from "../api";

const BRAND_NAME = "Coursera Education";

function pickToken(payload) {
  if (!payload) return "";
  if (typeof payload === "string") return "";
  return (
    payload.token ||
    payload.accessToken ||
    payload.access_token ||
    payload?.data?.token ||
    payload?.data?.accessToken ||
    ""
  );
}

function pickField(payload, ...keys) {
  if (!payload || typeof payload !== "object") return undefined;
  for (const key of keys) {
    if (payload[key] !== undefined && payload[key] !== null && payload[key] !== "") {
      return payload[key];
    }
    if (payload.data && payload.data[key] !== undefined && payload.data[key] !== null) {
      return payload.data[key];
    }
  }
  return undefined;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [contactOpen, setContactOpen] = useState(false);

  const isValid = form.email.includes("@") && form.password.length >= 6;

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid || status === "submitting") return;

    setStatus("submitting");
    setErrorMsg("");

    const userEmail = form.email.trim();
    const formData = {
      userName: userEmail,
      password: form.password,
    };

    try {
      // 1) Public key
      const keyRes = await authApi.getPublicKey({
        merchantId: userEmail,
        includePayVangHeaders: true,
      });
      const publicKey = keyRes?.data ?? keyRes?.publicKey ?? keyRes;
      if (!publicKey) throw new Error("Public key missing");

      // 2) AES key (keep in local var — do not rely on React state timing)
      const aesKeyWordArray = CryptoJS.lib.WordArray.random(16);
      const aesKeyBase64 = aesKeyWordArray.toString(CryptoJS.enc.Base64);

      // 3) Encrypt + POST /generate-token
      const encData = await encryptRequestData(formData, publicKey, aesKeyBase64);
      const tokenRes = await authApi.generateToken(encData, {
        merchantId: userEmail,
        includePayVangHeaders: true,
      });

      if (tokenRes?.status === "fail") {
        throw new Error(tokenRes?.message || "Login failed");
      }

      // 4) Decrypt response with the same AES key used to encrypt
      const encryptedPayload = tokenRes?.data ?? tokenRes;
      const resp = await decryptResponse(encryptedPayload, aesKeyBase64);
      console.log("[Login] decrypted response:", resp);

      const token = pickToken(resp);
      if (!token) {
        throw new Error("Login failed. Token missing in server response.");
      }

      const userRole = pickField(resp, "userRole", "role", "user_role") || "USER";
      const email = pickField(resp, "email", "userName", "user_email") || userEmail;
      const fullName = pickField(resp, "fullName", "name", "user_fullName") || "";
      const verified = pickField(resp, "verified", "user_verified");
      const payoutEnabledViaApp = pickField(resp, "payoutEnabledViaApp");

      // 5) Persist before navigate (localStorage if Remember me, else sessionStorage)
      const saved = saveAuthToken(
        token,
        userRole,
        email,
        fullName,
        verified,
        payoutEnabledViaApp,
        { remember: form.remember }
      );

      if (!saved) {
        throw new Error("Unable to save login session.");
      }

      console.log(
        "[Login] saved to",
        form.remember ? "localStorage" : "sessionStorage",
        {
          auth_token: token ? "(set)" : "(empty)",
          user_role: userRole,
          user_email: email,
          user_fullName: fullName,
        }
      );

      navigate("/home");
    } catch (err) {
      console.error("[Login] failed:", err);
      setErrorMsg(err?.message || "Login failed. Please check your credentials and try again.");
      setStatus("idle");
    }
  }

  return (
    <div className="ld-root">
      <style>{CSS}</style>

      <Navbar brandName={BRAND_NAME} onCtaClick={() => setContactOpen(true)} />

      <section className="auth-section">
        <div className="auth-card">
          <div className="auth-card-head">
            <div className="ld-pill">
              <span className="ld-dot" /> Welcome back
            </div>
            <h1>Log in to your account</h1>
            <p>Access your AI training dashboard, lessons, and team progress.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="login-password">Password</label>
              <div className="auth-password-wrap">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="auth-toggle-pw"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="auth-row">
              <label className="auth-check">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) => updateField("remember", e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a href="#forgot" className="auth-link">Forgot password?</a>
            </div>

            {errorMsg && <div className="auth-alert">{errorMsg}</div>}

            <button
              type="submit"
              className="ld-btn ld-btn--primary auth-submit"
              disabled={!isValid || status === "submitting"}
            >
              {status === "submitting" ? "Signing in…" : "Log in"} <span aria-hidden>→</span>
            </button>
          </form>

          <p className="auth-switch">
            Don&rsquo;t have an account?{" "}
            <Link to="/signup" className="auth-link auth-link--bold">Sign up</Link>
          </p>
        </div>
      </section>

      <footer className="ld-footer">
        <div className="ld-footer-bottom">
          © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
        </div>
      </footer>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}

const CSS = `
:root {
  --bg-0: #ffffff;
  --bg-1: #f9f0e7;
  --bg-2: #f3e2d0;
  --card: #ffffff;
  --card-border: rgba(122,23,53,0.12);
  --text-0: #241417;
  --text-1: #6b5a56;
  --text-2: #a3908b;
  --accent-orange: #7a1735;
  --accent-teal: #c1922f;
  --accent-red: #dc2626;
  --gradient: linear-gradient(90deg, var(--accent-orange), var(--accent-teal));
  --radius-lg: 22px;
  --radius-md: 16px;
  --shadow-sm: 0 1px 2px rgba(36,20,23,0.04);
  --shadow-md: 0 14px 34px -18px rgba(36,20,23,0.20);
  --font-display: 'Space Grotesk', 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
}

.ld-root { background: var(--bg-0); color: var(--text-0); font-family: var(--font-body); overflow-x: hidden; line-height: 1.5; min-height: 100vh; display: flex; flex-direction: column; }
.ld-root * { box-sizing: border-box; }

.ld-nav { position: sticky; top: 0; z-index: 50; padding: 18px 24px; }
.ld-nav-inner {
  max-width: 1180px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between;
  background: #ffffff; border: 1px solid var(--card-border); border-radius: 999px;
  padding: 10px 14px 10px 20px; box-shadow: var(--shadow-sm);
}
.ld-logo { font-family: var(--font-display); font-weight: 700; color: var(--text-0); text-decoration: none; display: flex; align-items: center; }
.ld-nav-links { display: flex; gap: 28px; }
.ld-nav-links a { color: var(--text-1); text-decoration: none; font-size: 14.5px; font-weight: 500; }
.ld-nav-link--active { color: var(--text-0) !important; }
.ld-nav-actions { display: flex; align-items: center; gap: 16px; }
.ld-nav-auth-link { color: var(--text-1); text-decoration: none; font-size: 14px; font-weight: 500; }
.ld-nav-auth-link:hover { color: var(--text-0); }

.ld-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 12px 22px; border-radius: 999px; font-weight: 600; font-size: 14.5px; text-decoration: none;
  border: 1px solid transparent; cursor: pointer; transition: transform .2s ease, box-shadow .2s ease, opacity .2s ease;
  font-family: var(--font-body);
}
.ld-btn:hover { transform: translateY(-1px); }
.ld-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
.ld-btn--sm { padding: 9px 16px; font-size: 13.5px; }
.ld-btn--primary { background: var(--gradient); color: #ffffff; box-shadow: 0 10px 24px -8px rgba(122,23,53,0.45); }

.ld-pill { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-1); border: 1px solid var(--card-border); background: #fff; padding: 7px 16px; border-radius: 999px; margin-bottom: 20px; }
.ld-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent-teal); display: inline-block; }

.auth-section {
  flex: 1; display: flex; align-items: center; justify-content: center;
  padding: 48px 24px 64px;
  background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249,240,231,0.9) 0%, transparent 70%);
}
.auth-card {
  width: 100%; max-width: 440px;
  background: var(--bg-1); border: 1px solid var(--card-border);
  border-radius: var(--radius-lg); padding: 40px 36px;
  box-shadow: var(--shadow-md);
}
.auth-card-head { text-align: center; margin-bottom: 32px; }
.auth-card-head h1 {
  font-family: var(--font-display); font-size: clamp(1.6rem, 3vw, 1.9rem);
  font-weight: 700; margin: 0 0 10px; letter-spacing: -0.01em; color: var(--text-0);
}
.auth-card-head p { color: var(--text-1); font-size: 15px; margin: 0; line-height: 1.55; }

.auth-field { margin-bottom: 18px; }
.auth-field label { display: block; font-size: 13px; font-weight: 600; color: var(--text-0); margin-bottom: 7px; }
.auth-field input {
  width: 100%; padding: 12px 14px; border-radius: 12px;
  border: 1px solid var(--card-border); background: #ffffff;
  font-family: var(--font-body); font-size: 14.5px; color: var(--text-0);
  transition: border-color .2s ease, box-shadow .2s ease;
}
.auth-field input::placeholder { color: var(--text-2); }
.auth-field input:focus {
  outline: none; border-color: var(--accent-teal);
  box-shadow: 0 0 0 3px rgba(193,146,47,0.18);
}

.auth-password-wrap { position: relative; }
.auth-password-wrap input { padding-right: 72px; }
.auth-toggle-pw {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer;
  font-size: 12.5px; font-weight: 600; color: var(--accent-orange);
  font-family: var(--font-body); padding: 4px 6px;
}
.auth-toggle-pw:hover { color: var(--accent-teal); }

.auth-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; gap: 12px; flex-wrap: wrap; }
.auth-check { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13.5px; color: var(--text-1); }
.auth-check input { width: 16px; height: 16px; accent-color: var(--accent-orange); cursor: pointer; }

.auth-link { color: var(--accent-orange); text-decoration: none; font-size: 13.5px; font-weight: 500; }
.auth-link:hover { color: var(--accent-teal); text-decoration: underline; }
.auth-link--bold { font-weight: 600; }

.auth-alert {
  background: rgba(220,38,38,0.08); border: 1px solid rgba(220,38,38,0.25);
  color: var(--accent-red); border-radius: 12px; padding: 11px 14px;
  font-size: 13.5px; margin-bottom: 16px;
}

.auth-submit { width: 100%; padding: 14px 22px; font-size: 15px; justify-content: center; }
.auth-switch { text-align: center; margin: 24px 0 0; font-size: 14px; color: var(--text-1); }

.ld-footer { padding: 32px 24px; background: var(--bg-1); border-top: 1px solid var(--card-border); margin-top: auto; }
.ld-footer-bottom { max-width: 1180px; margin: 0 auto; font-size: 12.5px; color: var(--text-2); text-align: center; }

.ld-modal-overlay { position: fixed; inset: 0; background: rgba(36,20,23,0.55); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 24px; }
.ld-modal { position: relative; background: #ffffff; border-radius: var(--radius-lg); max-width: 480px; width: 100%; padding: 40px; box-shadow: var(--shadow-md); max-height: 90vh; overflow-y: auto; }
.ld-modal-close { position: absolute; top: 20px; right: 20px; width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--card-border); background: #fff; cursor: pointer; font-size: 14px; color: var(--text-1); }
.ld-modal-close:hover { background: var(--bg-1); }
.ld-modal-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: var(--accent-orange); border: 1px solid rgba(122,23,53,0.30); background: rgba(122,23,53,0.06); padding: 8px 18px; border-radius: 999px; margin-bottom: 20px; }
.ld-modal h3 { font-family: var(--font-display); font-size: 26px; margin: 0 0 12px; color: var(--text-0); }
.ld-modal-sub { color: var(--text-1); font-size: 14.5px; margin: 0 0 28px; }
.ld-field { margin-bottom: 20px; }
.ld-field label { display: block; font-size: 14px; font-weight: 600; color: var(--text-0); margin-bottom: 8px; }
.ld-field input, .ld-field textarea { width: 100%; border: 1px solid var(--card-border); background: var(--bg-1); border-radius: 12px; padding: 14px 16px; font-size: 14.5px; font-family: var(--font-body); color: var(--text-0); resize: vertical; }
.ld-field textarea { min-height: 110px; }
.ld-field input:focus, .ld-field textarea:focus { outline: 2px solid var(--accent-teal); outline-offset: 1px; }
.ld-modal-submit { width: 100%; justify-content: center; margin-top: 6px; }
.ld-modal-success { text-align: center; padding: 20px 0; }
.ld-modal-success-icon { width: 56px; height: 56px; border-radius: 50%; background: var(--gradient); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 24px; margin: 0 auto 20px; }

@media (max-width: 720px) {
  .ld-nav-links { display: none; }
  .auth-card { padding: 32px 24px; }
}
`;