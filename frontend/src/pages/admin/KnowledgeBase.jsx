import React, { useEffect, useState } from 'react';
import { Search, Plus, CheckCircle, Edit2, Trash2, X, Save, AlertTriangle } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import { knowledgeBase as seedData, CATEGORIES } from '../../data/knowledgeBase.js';

export default function KnowledgeBase() {
  const [items, setItems] = useState([...seedData]);
  const [filtered, setFiltered] = useState([...seedData]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('ALL');
  const [editing, setEditing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ category: 'agriculture', questionTamil: '', question: '', answer: '', source: '', sourceUrl: '', verified: false });

  useEffect(() => {
    let r = items;
    if (search) r = r.filter(i => i.question?.toLowerCase().includes(search.toLowerCase()) || i.questionTamil?.includes(search));
    if (catFilter !== 'ALL') r = r.filter(i => i.category === catFilter);
    setFiltered(r);
  }, [search, catFilter, items]);

  const handleDelete = (id) => {
    if (window.confirm('Delete this FAQ?')) setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleVerify = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, verified: !i.verified } : i));
  };

  const handleAdd = () => {
    if (!newItem.questionTamil || !newItem.answer) return;
    const item = { ...newItem, id: `kb-${Date.now()}`, lastUpdated: new Date().toISOString().split('T')[0], keywords: [] };
    setItems(prev => [item, ...prev]);
    setShowAdd(false);
    setNewItem({ category: 'agriculture', questionTamil: '', question: '', answer: '', source: '', sourceUrl: '', verified: false });
  };

  const catColors = {
    agriculture: 'badge-green',
    government: 'badge-blue',
    health: 'badge-red',
    general: 'badge-gray',
  };

  return (
    <AdminLayout title="Knowledge Base">
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)',
          padding: '0.5rem 0.875rem', flex: 1, minWidth: 200,
        }}>
          <Search size={15} color="var(--gray-400)" />
          <input
            placeholder="Search knowledge base…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem', color: 'var(--color-text)', background: 'transparent' }}
          />
        </div>
        <select className="form-input form-select" style={{ width: 160 }} value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          <option value="ALL">All Categories</option>
          <option value="agriculture">Agriculture</option>
          <option value="government">Government</option>
          <option value="health">Health</option>
          <option value="general">General</option>
        </select>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
          <Plus size={15} /> Add FAQ
        </button>
        <span className="text-sm" style={{ color: 'var(--gray-500)' }}>{filtered.length} records</span>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="card" style={{ marginBottom: '1.25rem', border: '1.5px solid var(--green-300)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div className="font-semibold">Add New FAQ</div>
            <button onClick={() => setShowAdd(false)} style={{ color: 'var(--gray-400)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input form-select" value={newItem.category} onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))}>
                <option value="agriculture">Agriculture</option>
                <option value="government">Government</option>
                <option value="health">Health</option>
                <option value="general">General</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Source Name</label>
              <input className="form-input" placeholder="e.g. TNAU" value={newItem.source} onChange={e => setNewItem(p => ({ ...p, source: e.target.value }))} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Tamil Question</label>
              <input className="form-input" style={{ fontFamily: 'var(--font-tamil)' }} placeholder="தமிழில் கேள்வி…" value={newItem.questionTamil} onChange={e => setNewItem(p => ({ ...p, questionTamil: e.target.value }))} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">English Question</label>
              <input className="form-input" placeholder="English question" value={newItem.question} onChange={e => setNewItem(p => ({ ...p, question: e.target.value }))} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Answer</label>
              <textarea className="form-input form-textarea" value={newItem.answer} onChange={e => setNewItem(p => ({ ...p, answer: e.target.value }))} rows={4} placeholder="Detailed answer…" />
            </div>
            <div className="form-group">
              <label className="form-label">Source URL</label>
              <input className="form-input" type="url" placeholder="https://…" value={newItem.sourceUrl} onChange={e => setNewItem(p => ({ ...p, sourceUrl: e.target.value }))} />
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
              <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input type="checkbox" checked={newItem.verified} onChange={e => setNewItem(p => ({ ...p, verified: e.target.checked }))} />
                Mark as Verified
              </label>
            </div>
          </div>
          {!newItem.verified && (
            <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center', marginTop: '0.75rem', fontSize: '0.8125rem', color: 'var(--amber-600)' }}>
              <AlertTriangle size={13} />
              Unverified FAQs will not appear as verified to users. Verify source before marking.
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.625rem', marginTop: '1rem' }}>
            <button className="btn btn-primary btn-sm" onClick={handleAdd}>
              <Save size={14} /> Save FAQ
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="table-wrapper">
        {filtered.length === 0 ? (
          <div className="empty-state"><div className="text-sm">No FAQs found.</div></div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Tamil Question</th>
                <th>Category</th>
                <th>Source</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={i}>
                  <td style={{ maxWidth: 320 }}>
                    <div style={{ fontFamily: 'var(--font-tamil)', fontSize: '0.875rem', color: 'var(--gray-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.questionTamil || item.question}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.question}
                    </div>
                  </td>
                  <td><span className={`badge ${catColors[item.category] || 'badge-gray'}`}>{item.category}</span></td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--gray-600)' }}>{item.source || '—'}</td>
                  <td>
                    {item.verified ? (
                      <span className="badge badge-green"><CheckCircle size={11} /> Verified</span>
                    ) : (
                      <span className="badge badge-amber">Unverified</span>
                    )}
                  </td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>{item.lastUpdated || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      <button
                        className="btn btn-sm btn-ghost"
                        style={{ padding: '0.3rem 0.5rem', color: item.verified ? 'var(--green-600)' : 'var(--gray-400)' }}
                        onClick={() => handleVerify(item.id)}
                        title={item.verified ? 'Unverify' : 'Mark as verified'}
                      >
                        <CheckCircle size={13} />
                      </button>
                      <button
                        className="btn btn-sm btn-ghost"
                        style={{ padding: '0.3rem 0.5rem', color: 'var(--red-400)' }}
                        onClick={() => handleDelete(item.id)}
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Knowledge Base Repository Notice */}
      <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'var(--green-50)', border: '1px solid var(--green-200)', borderRadius: 'var(--radius-lg)', fontSize: '0.8125rem', color: 'var(--green-800)' }}>
        🛡️ <strong>Grounded Knowledge Repository</strong> — Agriculture FAQs, government scheme eligibility criteria, and health advisories verified against TNAU and official government portals.
      </div>
    </AdminLayout>
  );
}
