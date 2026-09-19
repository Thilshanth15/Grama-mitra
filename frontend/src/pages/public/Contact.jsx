import React, { useState } from 'react';
import { Mail, Phone, Globe, MessageCircle, MapPin, Send, CheckCircle } from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout.jsx';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PublicLayout>
      {/* Header */}
      <section style={{
        background: '#000000',
        padding: '5.5rem 0 3.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <span className="section-label">Get In Touch</span>
          </div>
          <h1 className="section-title">Contact Grama Mitra</h1>
          <p className="section-subtitle">
            Questions, feedback, partnership inquiries, or support — we're here to help.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: '#050507', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'start' }}>
            {/* Contact info */}
            <div>
              <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '1.5rem' }}>
                Available channels
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { icon: Globe, color: 'var(--green-400)', bg: 'rgba(16, 185, 129, 0.15)', name: 'Website Assistant', val: 'gramaMitra.in', note: 'Live', sub: 'Interactive Tamil voice + text assistant available 24/7.', href: '/assistant', isInternal: true },
                  { icon: MessageCircle, color: '#25D366', bg: 'rgba(37, 211, 102, 0.15)', name: 'WhatsApp Bot', val: '+91 94440 XXXXX', note: 'Active Bot', sub: 'Tamil voice notes and instant text inquiries.', href: 'https://wa.me/?text=Vanakkam%20Grama%20Mitra', isInternal: false },
                  { icon: Phone, color: 'var(--amber-400)', bg: 'rgba(245, 158, 11, 0.15)', name: 'Toll-Free Helpline', val: '1800-180-1551', note: 'Kisan Helpline', sub: 'Direct agricultural phone assistance for all rural callers.', href: 'tel:18001801551', isInternal: false },
                  { icon: Mail, color: 'var(--blue-400)', bg: 'rgba(56, 189, 248, 0.15)', name: 'Email Support', val: 'hello@gramaMitra.in', note: '', sub: 'For government partnerships, research, and general queries.', href: 'mailto:hello@gramaMitra.in', isInternal: false },
                ].map((ch, i) => (
                  <a
                    key={i}
                    href={ch.href}
                    target={ch.isInternal ? undefined : '_blank'}
                    rel={ch.isInternal ? undefined : 'noopener noreferrer'}
                    style={{
                      display: 'flex', gap: '1.25rem', alignItems: 'flex-start',
                      padding: '1.35rem 1.5rem', background: 'var(--color-surface-raised)',
                      border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)',
                      transition: 'all 0.2s', textDecoration: 'none', cursor: 'pointer',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = ch.color;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                      e.currentTarget.style.transform = 'none';
                    }}
                    aria-label={`Open ${ch.name}`}
                  >
                    <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: ch.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <ch.icon size={22} color={ch.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <span className="font-semibold" style={{ color: 'var(--gray-900)', fontSize: '1.05rem' }}>{ch.name}</span>
                        {ch.note && <span className={`badge ${ch.note === 'Live' || ch.note === 'Active Bot' ? 'badge-green' : 'badge-blue'}`}>{ch.note}</span>}
                      </div>
                      <div style={{ fontWeight: 700, color: ch.color, fontSize: '0.95rem', marginBottom: '0.35rem' }}>{ch.val}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--gray-400)', lineHeight: 1.5 }}>{ch.sub}</div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Emergency */}
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--red-50)', border: '1px solid var(--red-200)', borderRadius: 'var(--radius-xl)' }}>
                <div className="font-bold" style={{ color: 'var(--red-700)', marginBottom: '0.375rem' }}>🚨 Medical Emergency</div>
                <div className="text-sm" style={{ color: 'var(--red-600)' }}>
                  Call <strong>108</strong> (National Ambulance) immediately. Do not wait for AI assistance in a medical emergency.
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="card">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '1.5rem' }}>
                Send a message
              </h2>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <CheckCircle size={28} color="var(--green-600)" />
                  </div>
                  <h3 style={{ fontWeight: 700, color: 'var(--gray-900)', marginBottom: '0.5rem' }}>Message sent!</h3>
                  <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>Thank you for reaching out. We'll get back to you soon.</p>
                  <button className="btn btn-outline btn-sm" style={{ marginTop: '1.25rem' }} onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group">
                      <label className="form-label">Name</label>
                      <input className="form-input" placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input className="form-input" placeholder="What is this about?" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea className="form-input form-textarea" placeholder="Tell us more…" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required rows={4} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                    <Send size={16} />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
