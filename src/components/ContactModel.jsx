import React, { useEffect, useState } from "react";

export default function ContactModal({ open, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setForm({ name: "", email: "", message: "" });
        setSubmitted(false);
        setSubmitting(false);
      }, 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div
      className="ld-modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="ld-modal" role="dialog" aria-modal="true" aria-labelledby="ld-modal-title">
        <button className="ld-modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {!submitted ? (
          <>
            <div className="ld-modal-eyebrow">
              <span className="ld-dot" /> Let&rsquo;s talk training
            </div>
            <h3 id="ld-modal-title">Get in Touch</h3>
            <p className="ld-modal-sub">
              Tell us a bit about your team and goals — we&rsquo;ll get back to you within 1–2 business days.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="ld-field">
                <label htmlFor="ld-name">Name</label>
                <input
                  id="ld-name"
                  type="text"
                  placeholder="Alex Morgan"
                  value={form.name}
                  onChange={update("name")}
                  required
                />
              </div>

              <div className="ld-field">
                <label htmlFor="ld-email">Email</label>
                <input
                  id="ld-email"
                  type="email"
                  placeholder="alex@company.com"
                  value={form.email}
                  onChange={update("email")}
                  required
                />
              </div>

              <div className="ld-field">
                <label htmlFor="ld-message">Message</label>
                <textarea
                  id="ld-message"
                  placeholder="Tell us about your team, stack, and what you'd like to learn..."
                  value={form.message}
                  onChange={update("message")}
                  required
                />
              </div>

              <button type="submit" className="ld-btn ld-btn--primary ld-modal-submit" disabled={submitting}>
                {submitting ? "Sending..." : "Send Message"} <span aria-hidden>→</span>
              </button>
            </form>
          </>
        ) : (
          <div className="ld-modal-success">
            <div className="ld-modal-success-icon">✓</div>
            <h3>Message Sent!</h3>
            <p className="ld-modal-sub">
              Thanks, {form.name.split(" ")[0]}! We&rsquo;ve received your message and will be in touch shortly.
            </p>
            <button className="ld-btn ld-btn--outline ld-modal-submit" onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}