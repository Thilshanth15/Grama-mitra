import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin, AlertTriangle, CheckCircle, Clock, Filter, RefreshCw,
  Search, Info, Eye, Layers, ShieldAlert, Sparkles, Building2, Leaf, Heart
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import { INITIAL_HOTSPOTS, HOTSPOT_CATEGORIES, PRIORITY_LEVELS, DISTRICTS } from '../../data/hotspotData.js';

// Priority Colors
const PRIORITY_COLORS = {
  Emergency: '#ef4444', // RED
  High: '#f97316',      // ORANGE
  Medium: '#eab308',    // YELLOW
  Low: '#22c55e',       // GREEN
};

const CATEGORY_ICONS = {
  Agriculture: Leaf,
  'Government Schemes': Building2,
  Health: Heart,
  'General Assistance': Info,
};

export default function Hotspots() {
  const [hotspots, setHotspots] = useState(INITIAL_HOTSPOTS);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeHotspot, setActiveHotspot] = useState(INITIAL_HOTSPOTS[0]);

  // Filtered hotspots
  const filteredHotspots = useMemo(() => {
    return hotspots.filter(item => {
      const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchPri = selectedPriority === 'ALL' || item.priority === selectedPriority;
      const matchDist = selectedDistrict === 'ALL' || item.district === selectedDistrict;
      const matchQuery = !searchQuery.trim() ||
        item.location_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.main_issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hotspot_id.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchPri && matchDist && matchQuery;
    });
  }, [hotspots, selectedCategory, selectedPriority, selectedDistrict, searchQuery]);

  // Statistics
  const totalLocations = filteredHotspots.length;
  const highPriorityCount = filteredHotspots.filter(h => h.priority === 'High' || h.priority === 'Emergency').length;
  const pendingCount = filteredHotspots.filter(h => h.status === 'Pending').length;
  const topCategory = 'Agriculture (54%)';

  const resetFilters = () => {
    setSelectedCategory('ALL');
    setSelectedPriority('ALL');
    setSelectedDistrict('ALL');
    setSearchQuery('');
  };

  return (
    <AdminLayout title="Risk Hotspot Mapping & Geospatial Analytics">
      {/* Geospatial Info Banner */}
      <div style={{
        marginBottom: '1.25rem',
        padding: '0.75rem 1rem',
        background: 'rgba(59, 130, 246, 0.08)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--blue-700)' }}>
          <Info size={16} />
          <span><strong>Geospatial Risk Analytics:</strong> Visualizing aggregated community query hotspots across Tamil Nadu districts in real-time.</span>
        </div>
        <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'var(--green-100)', color: 'var(--green-800)', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
          LIVE GEOSPATIAL MAP
        </span>
      </div>

      {/* Summary KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', fontWeight: 600 }}>Total Hotspots</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--gray-900)', marginTop: '0.25rem' }}>{totalLocations}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--green-600)', marginTop: '0.25rem' }}>Across Tamil Nadu Districts</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', fontWeight: 600 }}>High / Critical Priority</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--red-600)', marginTop: '0.25rem' }}>{highPriorityCount}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--red-500)', marginTop: '0.25rem' }}>Urgent Action Recommended</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', fontWeight: 600 }}>Pending Officer Handoffs</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--amber-600)', marginTop: '0.25rem' }}>{pendingCount}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--amber-600)', marginTop: '0.25rem' }}>Awaiting Field Resolution</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', fontWeight: 600 }}>Primary Demand Domain</div>
          <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--green-700)', marginTop: '0.25rem' }}>{topCategory}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>TNAU Pest & Disease Queries</div>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--gray-700)' }}>
            <Filter size={16} />
            Filters:
          </div>

          {/* Search */}
          <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.625rem', border: '1px solid var(--gray-300)', borderRadius: 'var(--radius-md)' }}>
            <Search size={14} color="var(--gray-400)" />
            <input
              type="text"
              placeholder="Search location or issue..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.8125rem', background: 'transparent' }}
            />
          </div>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            style={{ padding: '0.375rem 0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-300)', fontSize: '0.8125rem' }}
          >
            {HOTSPOT_CATEGORIES.map(c => (
              <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>
            ))}
          </select>

          {/* Priority */}
          <select
            value={selectedPriority}
            onChange={e => setSelectedPriority(e.target.value)}
            style={{ padding: '0.375rem 0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-300)', fontSize: '0.8125rem' }}
          >
            {PRIORITY_LEVELS.map(p => (
              <option key={p} value={p}>{p === 'ALL' ? 'All Priorities' : `${p} Priority`}</option>
            ))}
          </select>

          {/* District */}
          <select
            value={selectedDistrict}
            onChange={e => setSelectedDistrict(e.target.value)}
            style={{ padding: '0.375rem 0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-300)', fontSize: '0.8125rem' }}
          >
            {DISTRICTS.map(d => (
              <option key={d} value={d}>{d === 'ALL' ? 'All Districts' : d}</option>
            ))}
          </select>

          <button
            onClick={resetFilters}
            className="btn btn-sm btn-ghost"
            style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <RefreshCw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* Main Map + Details Side Grid */}
      <div className="hotspot-main-grid">
        {/* Leaflet Map View */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', height: '480px', position: 'relative' }}>
          {/* Map Legend overlay */}
          <div style={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            padding: '0.625rem 0.875rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontSize: '0.75rem',
          }}>
            <div style={{ fontWeight: 700, marginBottom: '0.375rem', color: 'var(--gray-800)' }}>Hotspot Priority Legend</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: PRIORITY_COLORS.Emergency }} />
                <span>🔴 Emergency Escalation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: PRIORITY_COLORS.High }} />
                <span>🟠 High Demand</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: PRIORITY_COLORS.Medium }} />
                <span>🟡 Moderate Demand</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: PRIORITY_COLORS.Low }} />
                <span>🟢 Low Activity</span>
              </div>
            </div>
          </div>

          <MapContainer
            center={[10.7870, 78.8500]}
            zoom={7}
            style={{ width: '100%', height: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredHotspots.map(spot => {
              const color = PRIORITY_COLORS[spot.priority] || '#3b82f6';
              return (
                <CircleMarker
                  key={spot.hotspot_id}
                  center={[spot.latitude, spot.longitude]}
                  radius={spot.priority === 'Emergency' ? 14 : spot.priority === 'High' ? 11 : 8}
                  pathOptions={{
                    fillColor: color,
                    fillOpacity: 0.8,
                    color: '#ffffff',
                    weight: 2,
                  }}
                  eventHandlers={{
                    click: () => setActiveHotspot(spot),
                  }}
                >
                  <Popup>
                    <div style={{ fontFamily: 'var(--font-sans)', minWidth: 200 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', gap: '0.5rem', marginBottom: '0.375rem' }}>
                        <strong style={{ fontSize: '0.875rem', color: 'var(--gray-900)' }}>{spot.location_name}</strong>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)', marginBottom: '0.375rem' }}>
                        ID: <code>{spot.hotspot_id}</code> | Category: <strong>{spot.category}</strong>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--gray-800)', marginBottom: '0.5rem', fontWeight: 500 }}>
                        {spot.main_issue}
                      </div>
                      <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.6875rem', padding: '0.15rem 0.4rem', borderRadius: 'var(--radius-full)', background: `${color}20`, color, fontWeight: 700 }}>
                          {spot.priority} Priority
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: 'var(--gray-500)' }}>
                          {spot.report_count} Reports
                        </span>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        {/* Selected Hotspot Inspector Panel */}
        {activeHotspot ? (
          <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 600 }}>Hotspot Inspector</div>
              <span style={{
                fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)',
                background: `${PRIORITY_COLORS[activeHotspot.priority]}20`,
                color: PRIORITY_COLORS[activeHotspot.priority], fontWeight: 800,
              }}>
                {activeHotspot.priority} Priority
              </span>
            </div>

            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '0.25rem' }}>
                {activeHotspot.location_name}
              </h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                ID: {activeHotspot.hotspot_id} | District: {activeHotspot.district}
              </div>
            </div>

            <div style={{ padding: '0.75rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 600, marginBottom: '0.25rem' }}>
                Reported Community Issue:
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--gray-800)' }}>
                {activeHotspot.main_issue}
              </div>
            </div>

            <div style={{ padding: '0.75rem', background: 'var(--green-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--green-200)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--green-800)', fontWeight: 700, marginBottom: '0.25rem' }}>
                Recommended Action Plan:
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--green-900)' }}>
                {activeHotspot.recommended_action}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem' }}>
              <div>
                <span style={{ color: 'var(--gray-500)' }}>Query Volume:</span>
                <div style={{ fontWeight: 700, color: 'var(--gray-800)' }}>{activeHotspot.report_count} queries</div>
              </div>
              <div>
                <span style={{ color: 'var(--gray-500)' }}>Source Channel:</span>
                <div style={{ fontWeight: 700, color: 'var(--gray-800)' }}>{activeHotspot.source_type}</div>
              </div>
              <div>
                <span style={{ color: 'var(--gray-500)' }}>Handoff Status:</span>
                <div style={{ fontWeight: 700, color: 'var(--gray-800)' }}>{activeHotspot.status}</div>
              </div>
              <div>
                <span style={{ color: 'var(--gray-500)' }}>Last Updated:</span>
                <div style={{ fontWeight: 700, color: 'var(--gray-800)' }}>{activeHotspot.last_updated}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem' }}>
            <MapPin size={32} color="var(--gray-400)" />
            <div style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>Click any hotspot marker on the map to inspect details</div>
          </div>
        )}
      </div>

      {/* Hotspots Data Table */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '1rem' }}>
          Regional Hotspot Registry ({filteredHotspots.length})
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ background: 'var(--gray-50)', textAlign: 'left' }}>
                <th style={{ padding: '0.625rem' }}>Hotspot ID</th>
                <th style={{ padding: '0.625rem' }}>Location</th>
                <th style={{ padding: '0.625rem' }}>Category</th>
                <th style={{ padding: '0.625rem' }}>Priority</th>
                <th style={{ padding: '0.625rem' }}>Report Count</th>
                <th style={{ padding: '0.625rem' }}>Main Issue</th>
                <th style={{ padding: '0.625rem' }}>Status</th>
                <th style={{ padding: '0.625rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredHotspots.map(h => (
                <tr key={h.hotspot_id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                  <td style={{ padding: '0.625rem', fontFamily: 'monospace', fontWeight: 700 }}>{h.hotspot_id}</td>
                  <td style={{ padding: '0.625rem', fontWeight: 600 }}>{h.location_name}</td>
                  <td style={{ padding: '0.625rem' }}>{h.category}</td>
                  <td style={{ padding: '0.625rem' }}>
                    <span style={{
                      padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)',
                      background: `${PRIORITY_COLORS[h.priority]}20`,
                      color: PRIORITY_COLORS[h.priority], fontWeight: 700, fontSize: '0.7rem'
                    }}>
                      {h.priority}
                    </span>
                  </td>
                  <td style={{ padding: '0.625rem', fontWeight: 700 }}>{h.report_count}</td>
                  <td style={{ padding: '0.625rem', maxWidth: 260, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {h.main_issue}
                  </td>
                  <td style={{ padding: '0.625rem' }}>
                    <span className={`badge ${h.status === 'Resolved' ? 'badge-green' : h.status === 'Assigned' ? 'badge-blue' : 'badge-amber'}`}>
                      {h.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.625rem' }}>
                    <button
                      onClick={() => setActiveHotspot(h)}
                      className="btn btn-sm btn-ghost"
                      style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                    >
                      <Eye size={13} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
