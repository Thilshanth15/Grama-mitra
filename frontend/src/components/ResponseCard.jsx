import React from 'react';
import { CheckCircle, AlertTriangle, BookOpen, ExternalLink, RefreshCw, Users } from 'lucide-react';

function ConfidenceBar({ value, label }) {
  const pct = Math.round(value * 100);
  let color = 'var(--green-500)';
  if (pct < 60) color = 'var(--amber-500)';
  if (pct < 40) color = 'var(--red-500)';

  return (
    <div className="confidence-bar">
      <div className="progress-bar" style={{ flex: 1, height: 8 }}>
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-sm font-semibold" style={{ color, minWidth: 36 }}>{pct}%</span>
    </div>
  );
}

export default function ResponseCard({ result, onRetry, onHandoff, loading }) {
  if (loading) {
    return (
      <div className="card animate-fade" style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div className="spinner" />
          <div>
            <div className="font-semibold" style={{ color: 'var(--gray-700)' }}>Processing your question…</div>
            <div className="text-sm" style={{ color: 'var(--gray-500)' }}>உங்கள் கேள்வியை புரிந்துகொள்கிறோம்…</div>
          </div>
        </div>
        <div className="skeleton" style={{ height: 16, marginBottom: 8, borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 16, width: '80%', marginBottom: 8, borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 16, width: '60%', borderRadius: 6 }} />
      </div>
    );
  }

  if (!result) return null;

  const { response, confidence, source, isEmergency, needsHandoff, intent, confidenceLabel, disclaimer, handoffId } = result;

  return (
    <div className="card animate-slide" style={{ marginTop: '1.5rem', border: isEmergency ? '2px solid var(--red-400)' : undefined }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          {isEmergency ? (
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--red-100)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <AlertTriangle size={18} color="var(--red-600)" />
            </div>
          ) : (
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--green-100)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <CheckCircle size={18} color="var(--green-600)" />
            </div>
          )}
          <div>
            <div className="font-semibold text-sm" style={{ color: 'var(--gray-900)' }}>
              {isEmergency ? 'Emergency Safety Response' : 'Grama Mitra Response'}
            </div>
            <div className="text-xs" style={{ color: 'var(--gray-500)' }}>
              {intent && <span className="badge badge-blue" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>{intent?.replace('_', ' ')}</span>}
            </div>
          </div>
        </div>

        {/* Confidence badge */}
        {!isEmergency && (
          <div className={`badge ${confidence >= 0.8 ? 'badge-green' : confidence >= 0.6 ? 'badge-amber' : 'badge-red'}`}>
            {confidenceLabel || (confidence >= 0.8 ? 'High Confidence' : confidence >= 0.6 ? 'Moderate' : 'Needs Clarification')}
          </div>
        )}
        {isEmergency && <div className="badge badge-red">🚨 Emergency Protocol</div>}
      </div>

      {/* Response body */}
      <div className="prose" style={{
        background: isEmergency ? 'rgba(239, 68, 68, 0.14)' : 'rgba(255, 255, 255, 0.05)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        fontFamily: 'inherit',
        whiteSpace: 'pre-wrap',
        marginBottom: '1rem',
        border: isEmergency ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(255, 255, 255, 0.12)',
        color: '#ffffff',
        fontSize: '1.05rem',
        lineHeight: 1.75,
      }}>
        {response}
      </div>

      {/* Disclaimer */}
      {disclaimer && (
        <div className="highlight-box amber" style={{ marginBottom: '1rem', fontSize: '0.875rem', lineHeight: 1.6 }}>
          <AlertTriangle size={15} style={{ display: 'inline', marginRight: 6 }} />
          {disclaimer}
        </div>
      )}

      {/* Source */}
      {source && source.name && (
        <div className="source-card" style={{ marginBottom: '1rem' }}>
          <BookOpen size={18} color="var(--blue-400)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div className="font-semibold text-sm" style={{ color: '#ffffff', marginBottom: 2 }}>
              Verified Source
            </div>
            <div className="text-sm" style={{ color: 'var(--blue-400)', fontWeight: 600 }}>
              {source.name}
              {source.lastUpdated && <span style={{ color: '#cbd5e1', marginLeft: 8, fontWeight: 400 }}>· Updated {source.lastUpdated}</span>}
            </div>
            {source.url && (
              <a href={source.url} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: '#7dd3fc', marginTop: 4, fontWeight: 600 }}>
                Visit source <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Confidence bar */}
      {!isEmergency && confidence !== undefined && (
        <div style={{ marginBottom: '1rem' }}>
          <div className="text-xs font-semibold" style={{ color: 'var(--gray-500)', marginBottom: 6 }}>Response Confidence</div>
          <ConfidenceBar value={confidence} label={confidenceLabel} />
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
        {onRetry && !isEmergency && (
          <button className="btn btn-sm btn-ghost" onClick={onRetry}>
            <RefreshCw size={14} />
            Ask Another
          </button>
        )}
        {(needsHandoff || isEmergency) && onHandoff && (
          <button
            className="btn btn-sm"
            style={{
              background: isEmergency ? 'var(--red-600)' : 'var(--amber-500)',
              color: '#fff',
              borderColor: isEmergency ? 'var(--red-600)' : 'var(--amber-500)',
            }}
            onClick={() => onHandoff(result)}
          >
            <Users size={14} />
            {isEmergency ? 'Emergency Help' : 'Request Human Help'}
          </button>
        )}
        {handoffId && (
          <div className="text-xs" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--gray-500)', padding: '0.375rem 0' }}>
            <CheckCircle size={12} color="var(--green-500)" />
            Escalation ID: {handoffId}
          </div>
        )}
      </div>
    </div>
  );
}
