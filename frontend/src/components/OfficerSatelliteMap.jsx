import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Mic, Search, MapPin, Layers, Globe, Compass, AlertTriangle, ShieldCheck,
  CheckCircle, Loader2, Volume2, Sparkles, Navigation, RefreshCw, Info, Leaf, Activity
} from 'lucide-react';

// Custom Leaflet Pin Icon
const createCustomIcon = (color = '#10b981') => {
  return L.divIcon({
    className: 'custom-satellite-pin',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: ${color};
        border: 3px solid #ffffff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(0,0,0,0.6);
        animation: pulse 2s infinite;
      ">
        <div style="width: 10px; height: 10px; background: #ffffff; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Map Controller for smooth flyTo panning and zooming
function DynamicMapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1] && !isNaN(center[0]) && !isNaN(center[1])) {
      map.flyTo(center, zoom, {
        duration: 1.8,
        easeLinearity: 0.25,
      });
    }
  }, [center, zoom, map]);
  return null;
}

export default function OfficerSatelliteMap({ officerDistrict = 'Thanjavur', officerBlock = 'Kumbakonam' }) {
  // Voice & Navigation State
  const [locationQuery, setLocationQuery] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceLang, setVoiceLang] = useState('en-IN');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [mapMode, setMapMode] = useState('satellite'); // 'satellite' | 'street'
  const [errorMsg, setErrorMsg] = useState('');
  const [clarificationMsg, setClarificationMsg] = useState('');

  // Geocoded Result (Default to Thanjavur / Kumbakonam area, expandable to ALL India)
  const [geocodedData, setGeocodedData] = useState({
    lat: 10.9601,
    lon: 79.3782,
    zoom: 12,
    displayName: 'Kumbakonam, Thanjavur District, Tamil Nadu, India',
    state: 'Tamil Nadu',
    district: 'Thanjavur',
    block: 'Kumbakonam',
    village: 'Kovilur',
    level: 'Block / Taluk View',
  });

  // Example Regional Hotspots near geocoded center
  const [nearbyHotspots, setNearbyHotspots] = useState([
    { id: 1, name: 'Paddy Blast Outbreak Zone', lat: 10.965, lon: 79.382, risk: 'High', crop: 'Paddy (CO-51)', cases: 14 },
    { id: 2, name: 'BPH Pest Alert Cluster', lat: 10.952, lon: 79.365, risk: 'Critical', crop: 'Rice (ADT-45)', cases: 28 },
    { id: 3, name: 'PM-KISAN eKYC Verification Spot', lat: 10.971, lon: 79.390, risk: 'Low', crop: 'Sugarcane', cases: 5 },
  ]);

  // Handle Geocoding across ALL India locations (States, Districts, Blocks, Villages)
  const geocodeIndiaLocation = async (rawQuery) => {
    let query = rawQuery ? rawQuery.trim() : '';
    if (!query) return;

    // Clean common voice prefixes
    query = query
      .replace(/^(show|open|zoom into|go to|search|find|navigate to|look up)\s+/i, '')
      .replace(/^(காட்டு|திற|செல்|தேடு)\s+/i, '')
      .trim();

    setIsGeocoding(true);
    setErrorMsg('');
    setClarificationMsg('');

    try {
      // Append India context to ensure Nominatim targets Indian geographical entities
      const searchQuery = query.toLowerCase().includes('india') ? query : `${query}, India`;
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=in&addressdetails=1&limit=5`;

      const response = await fetch(url, {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9,ta;q=0.8',
        },
      });

      const data = await response.json();

      if (!data || data.length === 0) {
        setErrorMsg(`No Indian location matching "${rawQuery}" could be found. Try speaking a state, district, block, or village name.`);
        setIsGeocoding(false);
        return;
      }

      const primaryMatch = data[0];
      const lat = parseFloat(primaryMatch.lat);
      const lon = parseFloat(primaryMatch.lon);
      const address = primaryMatch.address || {};
      const type = (primaryMatch.addresstype || primaryMatch.type || '').toLowerCase();
      const placeClass = (primaryMatch.class || '').toLowerCase();

      // Dynamic Zoom & Hierarchy Level Resolution
      let zoom = 13;
      let level = 'Block / Local View';

      if (type === 'country' || query.toLowerCase() === 'india') {
        zoom = 5;
        level = 'National Country View';
      } else if (type === 'state' || (address.state && query.toLowerCase() === address.state.toLowerCase())) {
        zoom = 7;
        level = 'State Level View';
      } else if (type === 'county' || type === 'district' || address.district || query.toLowerCase().includes('district')) {
        zoom = 10;
        level = 'District Level View';
      } else if (type === 'taluk' || type === 'subdistrict' || query.toLowerCase().includes('block')) {
        zoom = 12;
        level = 'Block / Taluk View';
      } else {
        zoom = 15;
        level = 'Village / Local Detail View';
      }

      // Check for multiple location clarification
      if (data.length > 1) {
        const topAlternatives = data.slice(1, 3).map(m => m.display_name.split(',')[0]).join(', ');
        setClarificationMsg(`Navigated to primary result: ${primaryMatch.display_name.split(',')[0]}. Other matches: ${topAlternatives}.`);
      }

      // Update Geocoded State
      setGeocodedData({
        lat,
        lon,
        zoom,
        displayName: primaryMatch.display_name,
        state: address.state || 'India',
        district: address.state_district || address.district || address.county || 'Regional Area',
        block: address.subdistrict || address.taluk || address.city_district || 'Local Block',
        village: address.village || address.town || address.city || address.suburb || query,
        level,
      });

      // Generate dynamic local simulation markers around the geocoded lat/lon
      setNearbyHotspots([
        { id: 1, name: `${address.village || query} Primary Crop Alert`, lat: lat + 0.005, lon: lon + 0.005, risk: 'High', crop: 'Paddy / Maize', cases: 18 },
        { id: 2, name: `${address.district || query} Pest Warning Zone`, lat: lat - 0.006, lon: lon - 0.004, risk: 'Critical', crop: 'Cotton / Paddy', cases: 32 },
        { id: 3, name: `${query} Verified Farm Record Spot`, lat: lat + 0.008, lon: lon - 0.006, risk: 'Low', crop: 'Sugarcane / Pulses', cases: 7 },
      ]);
    } catch (err) {
      console.error(err);
      setErrorMsg('Geocoding service network request failed. Please verify internet connectivity.');
    } finally {
      setIsGeocoding(false);
    }
  };

  // Browser Speech-to-Text Voice AI Integration
  const toggleVoiceRecognition = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMsg('Web Speech STT API is not supported on this browser version. Use text search input below.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = voiceLang;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg('');
        setTranscript('');
      };

      recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        setTranscript(spokenText);
        setLocationQuery(spokenText);
        setIsListening(false);
        geocodeIndiaLocation(spokenText);
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        setErrorMsg(`Voice input error (${event.error}). Speak clearly or type location.`);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
      setErrorMsg('Speech recognition engine failed to start.');
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (locationQuery) {
      geocodeIndiaLocation(locationQuery);
    }
  };

  const handleQuickCommand = (cmdText) => {
    setLocationQuery(cmdText);
    geocodeIndiaLocation(cmdText);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #071217 0%, #04090d 100%)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '1.5rem',
      boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
      color: '#ffffff',
    }}>
      {/* ── HEADER TITLE BAR ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: '1.25rem',
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <Sparkles size={13} /> DYNAMIC ALL-INDIA STT & GEOCODING ACTIVE
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Compass size={24} color="#34d399" /> Universal AI Voice Satellite Navigation
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '0.25rem 0 0' }}>
            Speak or type ANY state, district, block, or village across India to automatically pan, zoom, and display satellite surveillance data.
          </p>
        </div>

        {/* Satellite vs Street Map Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'inline-flex', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '0.25rem' }}>
            <button
              onClick={() => setMapMode('satellite')}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: '8px',
                border: 'none',
                background: mapMode === 'satellite' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
                color: mapMode === 'satellite' ? '#ffffff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Globe size={14} /> Satellite Mode
            </button>

            <button
              onClick={() => setMapMode('street')}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: '8px',
                border: 'none',
                background: mapMode === 'street' ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'transparent',
                color: mapMode === 'street' ? '#ffffff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Layers size={14} /> Street Map
            </button>
          </div>
        </div>
      </div>

      {/* ── AI VOICE & SEARCH CONTROL PANEL ── */}
      <div style={{
        background: 'rgba(12, 34, 41, 0.7)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '18px',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          {/* Main Animated Mic AI Button */}
          <button
            onClick={toggleVoiceRecognition}
            style={{
              padding: '0.85rem 1.75rem',
              borderRadius: '16px',
              border: isListening ? '2px solid #ef4444' : '1px solid rgba(52, 211, 153, 0.6)',
              background: isListening
                ? 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.98rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              cursor: 'pointer',
              boxShadow: isListening ? '0 0 25px rgba(239, 68, 68, 0.8)' : '0 10px 25px rgba(16, 185, 129, 0.4)',
              transition: 'all 0.25s ease',
            }}
          >
            <Mic size={20} className={isListening ? 'animate-pulse' : ''} />
            <span>{isListening ? 'Listening Voice Input...' : 'Speak India Location'}</span>
          </button>

          {/* Voice Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>STT Language:</span>
            <select
              value={voiceLang}
              onChange={(e) => setVoiceLang(e.target.value)}
              style={{
                background: '#09181f',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffffff',
                padding: '0.45rem 0.75rem',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: 700,
                outline: 'none',
              }}
            >
              <option value="en-IN">English (India)</option>
              <option value="ta-IN">தமிழ் (Tamil)</option>
            </select>
          </div>

          {/* Fallback Text Search Input */}
          <form onSubmit={handleTextSubmit} style={{ flex: 1, minWidth: '260px', display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Or type any Indian State, District, Block, or Village..."
                style={{
                  width: '100%',
                  background: '#07161c',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '12px',
                  padding: '0.65rem 1rem 0.65rem 2.75rem',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isGeocoding}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                border: 'none',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              {isGeocoding ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
              <span>Navigate</span>
            </button>
          </form>
        </div>

        {/* Live Voice Status Feedback Bar */}
        {(isListening || transcript || isGeocoding) && (
          <div style={{
            background: 'rgba(6, 182, 212, 0.15)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: '12px',
            padding: '0.65rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            color: '#38bdf8',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}>
            {isListening && <Volume2 size={18} className="animate-bounce" />}
            {isGeocoding && <Loader2 size={18} className="animate-spin" />}
            <span>
              {isListening && 'Listening to speech... Say any Indian place (e.g., "Open Maharashtra", "Show Coimbatore", "Zoom into Kumbakonam").'}
              {isGeocoding && `Geocoding location coordinates for "${locationQuery}" across India database...`}
              {!isListening && !isGeocoding && transcript && `Voice Captured: "${transcript}"`}
            </span>
          </div>
        )}

        {/* Error / Alert Feedback */}
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '12px',
            padding: '0.65rem 1rem',
            color: '#fca5a5',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <AlertTriangle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Clarification Info Feedback */}
        {clarificationMsg && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '12px',
            padding: '0.65rem 1rem',
            color: '#fbbf24',
            fontSize: '0.82rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <Info size={16} />
            <span>{clarificationMsg}</span>
          </div>
        )}

        {/* Recommended Sample Voice Command Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Sample Voice Commands:</span>
          {[
            'Show Tamil Nadu',
            'Open Maharashtra',
            'Show Thanjavur district',
            'Go to Coimbatore',
            'Zoom into Kumbakonam',
            'Show Kerala',
          ].map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleQuickCommand(cmd)}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '9999px',
                padding: '0.25rem 0.75rem',
                color: '#cbd5e1',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#34d399';
                e.currentTarget.style.color = '#34d399';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.color = '#cbd5e1';
              }}
            >
              🎤 "{cmd}"
            </button>
          ))}
        </div>
      </div>

      {/* ── GEOCODED LOCATION HIERARCHY BADGE CARD ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '16px',
        padding: '1rem 1.25rem',
        marginBottom: '1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={20} color="#34d399" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              RESOLVED HIERARCHY ({geocodedData.level})
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginTop: '0.1rem' }}>
              India &rarr; {geocodedData.state} {geocodedData.district ? `\u2192 ${geocodedData.district}` : ''} {geocodedData.block ? `\u2192 ${geocodedData.block}` : ''} {geocodedData.village ? `\u2192 ${geocodedData.village}` : ''}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.15rem' }}>
              Full Geocoded Name: {geocodedData.displayName}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: 700 }}>
            Lat: {geocodedData.lat.toFixed(4)} | Lon: {geocodedData.lon.toFixed(4)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            Zoom Level: <strong style={{ color: '#ffffff' }}>{geocodedData.zoom}x</strong>
          </div>
        </div>
      </div>

      {/* ── LEAFLET SATELLITE MAP RENDERER ── */}
      <div style={{
        position: 'relative',
        height: '520px',
        width: '100%',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 15px 40px rgba(0,0,0,0.7)',
      }}>
        <MapContainer
          center={[geocodedData.lat, geocodedData.lon]}
          zoom={geocodedData.zoom}
          style={{ width: '100%', height: '100%', background: '#020617' }}
          zoomControl={true}
        >
          {/* Dynamic FlyTo Controller */}
          <DynamicMapController center={[geocodedData.lat, geocodedData.lon]} zoom={geocodedData.zoom} />

          {/* Base Tile Layer Switcher */}
          {mapMode === 'satellite' ? (
            <>
              {/* Esri World Imagery Satellite Tiles */}
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                maxZoom={18}
              />
              {/* CartoDB Voyager Labels Overlay */}
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
                attribution="&copy; OpenStreetMap contributors &copy; CARTO"
                maxZoom={18}
              />
            </>
          ) : (
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
              maxZoom={19}
            />
          )}

          {/* Primary Target Location Marker */}
          <Marker position={[geocodedData.lat, geocodedData.lon]} icon={createCustomIcon('#10b981')}>
            <Popup>
              <div style={{ fontFamily: 'Inter, sans-serif', padding: '0.25rem' }}>
                <strong style={{ fontSize: '0.95rem', color: '#0f172a', display: 'block', marginBottom: '0.25rem' }}>
                  {geocodedData.village || geocodedData.district || 'Geocoded Target'}
                </strong>
                <span style={{ fontSize: '0.8rem', color: '#475569' }}>
                  {geocodedData.state}, India
                </span>
                <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, marginTop: '0.4rem' }}>
                  Hierarchy: {geocodedData.level}
                </div>
              </div>
            </Popup>
          </Marker>

          {/* Circle Pulse Ring over geocoded area */}
          <CircleMarker
            center={[geocodedData.lat, geocodedData.lon]}
            radius={geocodedData.zoom > 12 ? 40 : 25}
            pathOptions={{
              color: '#34d399',
              fillColor: '#10b981',
              fillOpacity: 0.18,
              weight: 2,
            }}
          />

          {/* Regional Hotspot Markers */}
          {nearbyHotspots.map((hs) => (
            <Marker key={hs.id} position={[hs.lat, hs.lon]} icon={createCustomIcon(hs.risk === 'Critical' ? '#ef4444' : hs.risk === 'High' ? '#f59e0b' : '#38bdf8')}>
              <Popup>
                <div style={{ fontFamily: 'Inter, sans-serif', padding: '0.25rem' }}>
                  <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{hs.name}</strong>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.2rem 0' }}>Crop: {hs.crop}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: hs.risk === 'Critical' ? '#dc2626' : '#d97706' }}>
                    Risk: {hs.risk} ({hs.cases} Active Cases)
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Map Legend Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '12px',
          padding: '0.65rem 1rem',
          zIndex: 1000,
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} /> Targeted Location
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} /> High Risk Warning
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} /> Critical Outbreak
          </div>
        </div>
      </div>
    </div>
  );
}
