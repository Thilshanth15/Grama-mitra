import React, { useState } from 'react';
import { Mail, Phone, Globe, MessageCircle, MapPin, Send, CheckCircle, X, CheckCircle2, Mic, Volume2 } from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout.jsx';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [emailForm, setEmailForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [emailSuccess, setEmailSuccess] = useState('');
  const [copyToast, setCopyToast] = useState('');

  const handleChannelClick = (ch, e) => {
    if (ch.type === 'email') {
      e.preventDefault();
      setShowEmailModal(true);
    } else if (ch.type === 'phone') {
      e.preventDefault();
      setShowCallModal(true);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PublicLayout>
      {/* Toast Notification */}
      {copyToast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 999999,
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#ffffff', padding: '0.85rem 1.35rem', borderRadius: '14px',
          fontWeight: 800, fontSize: '0.9rem', boxShadow: '0 8px 25px rgba(16, 185, 129, 0.45)',
          display: 'flex', alignItems: 'center', gap: '0.6rem'
        }}>
          <CheckCircle2 size={18} /> {copyToast}
        </div>
      )}

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
                  { icon: Phone, color: 'var(--amber-400)', bg: 'rgba(245, 158, 11, 0.15)', name: 'Toll-Free Helpline', val: '1800-180-1551', note: 'Kisan Helpline', sub: 'Direct agricultural phone assistance for all rural callers.', type: 'phone', isInternal: false },
                  { icon: Mail, color: 'var(--blue-400)', bg: 'rgba(56, 189, 248, 0.15)', name: 'Email Support', val: 'hello@gramaMitra.in', note: 'Official Desk', sub: 'For government partnerships, research, and general queries.', type: 'email', isInternal: false },
                ].map((ch, i) => (
                  <a
                    key={i}
                    href={ch.href || '#'}
                    onClick={(e) => handleChannelClick(ch, e)}
                    target={ch.isInternal || ch.type ? undefined : '_blank'}
                    rel={ch.isInternal || ch.type ? undefined : 'noopener noreferrer'}
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
                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

      {/* ── TOLL-FREE CALL MODAL ── */}
      {showCallModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(2, 6, 15, 0.88)', backdropFilter: 'blur(20px)', zIndex: 99999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
        }}>
          <div style={{
            width: '100%', maxWidth: '480px', background: 'linear-gradient(135deg, #0f172a 0%, #090d16 100%)',
            border: '2px solid rgba(245, 158, 11, 0.6)', borderRadius: '28px', padding: '2.5rem 2rem',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 45px rgba(245, 158, 11, 0.35)', color: '#ffffff',
            position: 'relative', textAlign: 'center',
          }}>
            <button
              onClick={() => setShowCallModal(false)}
              style={{
                position: 'absolute', top: 18, right: 18, background: 'rgba(255,255,255,0.1)',
                border: 'none', color: '#94a3b8', borderRadius: '50%', width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(217, 119, 6, 0.4))',
              border: '2px solid #f59e0b', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1rem', boxShadow: '0 0 35px rgba(245, 158, 11, 0.5)',
            }}>
              <Phone size={36} color="#fbbf24" />
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>
              Toll-Free AI Voice Helpline
            </div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.25rem' }}>
              1800-180-1551
            </h2>
            <div style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem' }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 10px #34d399' }}></span>
              Line Active • Grama Mitra Voice IVR
            </div>
            <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('18001801551');
                  setCopyToast('Copied 1800-180-1551 to clipboard!');
                  setTimeout(() => setCopyToast(''), 3000);
                }}
                style={{
                  padding: '0.85rem 1.5rem', borderRadius: '14px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  border: 'none', color: '#ffffff', fontWeight: 900, fontSize: '0.92rem', cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(245, 158, 11, 0.45)',
                }}
              >
                Copy Helpline Number
              </button>
              <button
                onClick={() => setShowCallModal(false)}
                style={{
                  padding: '0.85rem 1.35rem', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255,255,255,0.2)', color: '#ffffff', fontWeight: 800, fontSize: '0.92rem', cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── OFFICIAL EMAIL INQUIRY MODAL ── */}
      {showEmailModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(2, 6, 15, 0.88)', backdropFilter: 'blur(20px)', zIndex: 99999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
        }}>
          <div style={{
            width: '100%', maxWidth: '520px', background: 'linear-gradient(135deg, #091524 0%, #050d18 100%)',
            border: '2px solid rgba(52, 211, 153, 0.6)', borderRadius: '28px', padding: '2.5rem 2rem',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 45px rgba(52, 211, 153, 0.35)', color: '#ffffff',
            position: 'relative',
          }}>
            <button
              onClick={() => { setShowEmailModal(false); setEmailSuccess(''); }}
              style={{
                position: 'absolute', top: 18, right: 18, background: 'rgba(255,255,255,0.1)',
                border: 'none', color: '#94a3b8', borderRadius: '50%', width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: 68, height: 68, borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(6, 182, 212, 0.4))',
                border: '2px solid #34d399', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1rem', boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)',
              }}>
                <Mail size={32} color="#34d399" />
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>
                Official Email Desk
              </div>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.25rem' }}>
                hello@gramaMitra.in
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
                Direct email channel for farmer support & government inquiries
              </p>
            </div>

            {emailSuccess ? (
              <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
                border: '1px solid #10b981', borderRadius: '18px', padding: '1.5rem', textAlign: 'center', color: '#34d399',
              }}>
                <CheckCircle2 size={40} color="#34d399" style={{ margin: '0 auto 0.75rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>Email Inquiry Transmitted!</h3>
                <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginBottom: '1.25rem' }}>
                  Your message has been logged and sent to <strong>hello@gramaMitra.in</strong>. Our team will respond shortly.
                </p>
                <button
                  onClick={() => { setShowEmailModal(false); setEmailSuccess(''); }}
                  style={{
                    padding: '0.75rem 1.5rem', borderRadius: '12px', background: '#10b981', color: '#fff',
                    fontWeight: 800, border: 'none', cursor: 'pointer',
                  }}
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!emailForm.email.trim() || !emailForm.message.trim()) return;
                  setEmailSuccess('Message sent successfully!');
                  setEmailForm({ name: '', email: '', subject: '', message: '' });
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
              >
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.4rem' }}>Your Name / பெயர்</label>
                  <input
                    type="text" placeholder="e.g. K. Ramasamy" value={emailForm.name}
                    onChange={(e) => setEmailForm(f => ({ ...f, name: e.target.value }))}
                    style={{ width: '100%', background: '#091524', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: '10px', padding: '0.65rem 0.85rem', color: '#fff', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.4rem' }}>Your Email Address *</label>
                  <input
                    type="email" required placeholder="e.g. farmer@gmail.com" value={emailForm.email}
                    onChange={(e) => setEmailForm(f => ({ ...f, email: e.target.value }))}
                    style={{ width: '100%', background: '#091524', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: '10px', padding: '0.65rem 0.85rem', color: '#fff', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.4rem' }}>Subject</label>
                  <input
                    type="text" placeholder="e.g. Advisory Request" value={emailForm.subject}
                    onChange={(e) => setEmailForm(f => ({ ...f, subject: e.target.value }))}
                    style={{ width: '100%', background: '#091524', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: '10px', padding: '0.65rem 0.85rem', color: '#fff', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.4rem' }}>Message Details *</label>
                  <textarea
                    required rows={3} placeholder="Type your inquiry or message here..." value={emailForm.message}
                    onChange={(e) => setEmailForm(f => ({ ...f, message: e.target.value }))}
                    style={{ width: '100%', background: '#091524', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: '10px', padding: '0.65rem 0.85rem', color: '#fff', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button
                    type="submit"
                    style={{
                      flex: 1, padding: '0.85rem', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none', color: '#fff', fontWeight: 900, fontSize: '0.92rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                      boxShadow: '0 4px 18px rgba(16, 185, 129, 0.4)',
                    }}
                  >
                    <Send size={16} /> Send Email Inquiry
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('hello@gramaMitra.in');
                      setCopyToast('Copied hello@gramaMitra.in to clipboard!');
                      setTimeout(() => setCopyToast(''), 3000);
                    }}
                    style={{
                      padding: '0.85rem 1rem', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.4)', color: '#38bdf8', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer',
                    }}
                  >
                    Copy Email
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
