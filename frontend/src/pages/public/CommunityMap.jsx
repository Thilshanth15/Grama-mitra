import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Shield, Info, Filter, ArrowRight } from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import { INITIAL_HOTSPOTS } from '../../data/hotspotData.js';

const PRIORITY_COLORS = {
  Emergency: '#ef4444',
  High: '#f97316',
  Medium: '#eab308',
  Low: '#22c55e',
};

export default function CommunityMap() {
  const [filterCategory, setFilterCategory] = useState('ALL');

  const filtered = filterCategory === 'ALL'
    ? INITIAL_HOTSPOTS
    : INITIAL_HOTSPOTS.filter(h => h.category === filterCategory);

  return (
    <PublicLayout>
      <div style={{ background: '#000000', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', padding: '5.5rem 0 3.5rem', color: '#fff' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <span className="section-label" style={{ display: 'inline-flex', gap: '0.5rem' }}>
              <MapPin size={15} color="var(--green-400)" />
              Community Risk & Assistance Map (பொது சமுதாய வரைபடம்)
            </span>
          </div>
          <h1 className="section-title" style={{ marginBottom: '1.25rem' }}>
            Rural Support Hotspots Across Tamil Nadu
          </h1>
          <p className="section-subtitle">
            Visualizing community assistance demand, crop protection alerts, and public welfare requests.
            All data is aggregated and anonymized to protect personal privacy.
          </p>
        </div>
      </div>

      <div style={{ background: '#000000', padding: '3.5rem 0 5rem' }}>
        <div className="container">
          {/* Privacy Note */}
          <div style={{
            padding: '1rem 1.25rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center',
            justify: 'space-between', flexWrap: 'wrap', gap: '0.75rem', boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.84rem', color: 'var(--gray-700)' }}>
              <Shield size={18} color="var(--green-600)" />
              <span><strong>Privacy Guardrail:</strong> Individual personal queries are aggregated by region. No personal names or exact home addresses are ever displayed.</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setFilterCategory('ALL')}
                className={`btn btn-sm ${filterCategory === 'ALL' ? 'btn-primary' : 'btn-ghost'}`}
              >
                All Regions
              </button>
              <button
                onClick={() => setFilterCategory('Agriculture')}
                className={`btn btn-sm ${filterCategory === 'Agriculture' ? 'btn-primary' : 'btn-ghost'}`}
              >
                🌾 Agriculture
              </button>
              <button
                onClick={() => setFilterCategory('Health')}
                className={`btn btn-sm ${filterCategory === 'Health' ? 'btn-primary' : 'btn-ghost'}`}
              >
                🏥 Health
              </button>
            </div>
          </div>

          {/* Map Container */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', height: '520px', marginBottom: '2rem' }}>
            <MapContainer
              center={[10.7870, 78.8500]}
              zoom={7}
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filtered.map(spot => {
                const color = PRIORITY_COLORS[spot.priority] || '#3b82f6';
                return (
                  <CircleMarker
                    key={spot.hotspot_id}
                    center={[spot.latitude, spot.longitude]}
                    radius={11}
                    pathOptions={{ fillColor: color, fillOpacity: 0.8, color: '#ffffff', weight: 2 }}
                  >
                    <Popup>
                      <div style={{ fontFamily: 'var(--font-sans)', padding: '0.25rem' }}>
                        <strong style={{ fontSize: '0.875rem' }}>{spot.location_name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)', marginTop: 2 }}>
                          Domain: <strong>{spot.category}</strong>
                        </div>
                        <div style={{ fontSize: '0.8125rem', marginTop: 4, fontWeight: 500 }}>
                          {spot.main_issue}
                        </div>
                        <div style={{ marginTop: 6, fontSize: '0.7rem', color: color, fontWeight: 700 }}>
                          ● {spot.priority} Priority Level | {spot.report_count} Reports
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
