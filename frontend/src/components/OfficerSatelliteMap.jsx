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
      background: '#08080c',
      borderRadius: '24px',
      border: '1px solid #c084fc',
      padding: '1.75rem',
      boxShadow: '0 25px 60px rgba(0,0,0,0.95), 0 0 45px rgba(192, 132, 252, 0.3)',
      backdropFilter: 'blur(20px)',
      color: '#ffffff',
    }}>
      {/* ── HEADER TITLE BAR ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.75rem',
        borderBottom: '1px solid rgba(255,255,255,0.12)',
        paddingBottom: '1.25rem',
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.35rem 0.95rem', borderRadius: '9999px',
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(236, 72, 153, 0.25))',
            border: '1px solid #c084fc', color: '#e879f9', fontSize: '0.8rem', fontWeight: 900,
            textTransform: 'uppercase', marginBottom: '0.65rem', boxShadow: '0 0 20px rgba(192, 132, 252, 0.35)',
          }}>
            <Sparkles size={14} color="#e879f9" /> DYNAMIC ALL-INDIA STT & GEOCODING ACTIVE
          </div>
          <h2 style={{
            fontSize: '1.85rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em',
            display: 'flex', alignItems: 'center', gap: '0.7rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #e879f9 50%, #38bdf8 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            <Compass size={32} color="#c084fc" style={{ filter: 'drop-shadow(0 0 14px rgba(192, 132, 252, 0.9))' }} />
            Universal AI Voice Satellite Navigation
          </h2>
          <p style={{ color: '#e2e8f0', fontSize: '0.94rem', margin: '0.35rem 0 0', fontWeight: 600 }}>
            Speak or type ANY state, district, block, or village across India to automatically pan, zoom, and display satellite surveillance data.
          </p>
        </div>

        {/* Satellite vs Street Map Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'inline-flex', background: '#121218', border: '1px solid rgba(192, 132, 252, 0.4)', borderRadius: '14px', padding: '0.35rem', boxShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
            <button
              onClick={() => setMapMode('satellite')}
              style={{
                padding: '0.55rem 1.15rem',
                borderRadius: '10px',
                border: 'none',
                background: mapMode === 'satellite' ? 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)' : 'transparent',
                color: mapMode === 'satellite' ? '#ffffff' : '#cbd5e1',
                fontWeight: 900,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: mapMode === 'satellite' ? '0 0 20px rgba(168, 85, 247, 0.6)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <Globe size={16} /> Satellite Mode
            </button>

            <button
              onClick={() => setMapMode('street')}
              style={{
                padding: '0.55rem 1.15rem',
                borderRadius: '10px',
                border: 'none',
                background: mapMode === 'street' ? 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)' : 'transparent',
                color: mapMode === 'street' ? '#000000' : '#cbd5e1',
                fontWeight: 900,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: mapMode === 'street' ? '0 0 20px rgba(56, 189, 248, 0.6)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <Layers size={16} /> Street Map
            </button>
          </div>
        </div>
      </div>

      {/* ── AI VOICE & SEARCH CONTROL PANEL ── */}
      <div style={{
        background: '#101018',
        border: '1px solid #c084fc',
        borderRadius: '20px',
        padding: '1.45rem 1.75rem',
        marginBottom: '1.6rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          {/* Main Animated Mic AI Button */}
          <button
            onClick={toggleVoiceRecognition}
            style={{
              padding: '0.95rem 1.95rem',
              borderRadius: '16px',
              border: isListening ? '2px solid #f43f5e' : '1px solid #c084fc',
              background: isListening
                ? 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)'
                : 'linear-gradient(135deg, #9333ea 0%, #4f46e5 100%)',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '1.05rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              boxShadow: isListening
                ? '0 0 35px rgba(244, 63, 94, 0.9)'
                : '0 0 35px rgba(147, 51, 234, 0.7), 0 10px 25px rgba(79, 70, 229, 0.4)',
              transition: 'all 0.25s ease',
            }}
          >
            <Mic size={24} className={isListening ? 'animate-pulse' : ''} />
            <span>{isListening ? 'Listening Voice Input...' : 'Speak India Location'}</span>
          </button>

          {/* Voice Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '0.88rem', color: '#38bdf8', fontWeight: 800 }}>STT Language:</span>
            <select
              value={voiceLang}
              onChange={(e) => setVoiceLang(e.target.value)}
              style={{
                background: '#1a1a24',
                border: '1px solid #38bdf8',
                color: '#ffffff',
                padding: '0.55rem 0.95rem',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 900,
                outline: 'none',
                boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
              }}
            >
              <option value="en-IN">English (India)</option>
              <option value="ta-IN">தமிழ் (Tamil)</option>
            </select>
          </div>

          {/* Fallback Text Search Input */}
          <form onSubmit={handleTextSubmit} style={{ flex: 1, minWidth: '280px', display: 'flex', gap: '0.65rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={20} color="#e879f9" style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Or type any Indian State, District, Block, or Village..."
                style={{
                  width: '100%',
                  background: '#161622',
                  border: '1px solid #c084fc',
                  borderRadius: '14px',
                  padding: '0.75rem 1rem 0.75rem 3rem',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  outline: 'none',
                  boxSizing: 'border-box',
                  boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.7)',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isGeocoding}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                border: '1px solid #38bdf8',
                color: '#000000',
                fontWeight: 900,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 0 20px rgba(56, 189, 248, 0.5)',
              }}
            >
              {isGeocoding ? <Loader2 size={18} className="animate-spin" /> : <Navigation size={18} />}
              <span>Navigate</span>
            </button>
          </form>
        </div>

        {/* Live Voice Status Feedback Bar */}
        {(isListening || transcript || isGeocoding) && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(56, 189, 248, 0.25))',
            border: '1px solid #c084fc',
            borderRadius: '14px',
            padding: '0.8rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#e879f9',
            fontSize: '0.92rem',
            fontWeight: 800,
            boxShadow: '0 0 20px rgba(192, 132, 252, 0.3)',
          }}>
            {isListening && <Volume2 size={20} className="animate-bounce" color="#e879f9" />}
            {isGeocoding && <Loader2 size={20} className="animate-spin" color="#e879f9" />}
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
            background: 'rgba(244, 63, 94, 0.25)',
            border: '1px solid #f43f5e',
            borderRadius: '14px',
            padding: '0.8rem 1.25rem',
            color: '#fb7185',
            fontSize: '0.9rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            boxShadow: '0 0 20px rgba(244, 63, 94, 0.3)',
          }}>
            <AlertTriangle size={20} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Clarification Info Feedback */}
        {clarificationMsg && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.25)',
            border: '1px solid #f59e0b',
            borderRadius: '14px',
            padding: '0.8rem 1.25rem',
            color: '#fbbf24',
            fontSize: '0.88rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)',
          }}>
            <Info size={18} />
            <span>{clarificationMsg}</span>
          </div>
        )}

        {/* Recommended Sample Voice Command Chips (DISTINCT VIBRANT COLORS!) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', color: '#e879f9', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sample Voice Commands:</span>
          {[
            { cmd: 'Show Tamil Nadu', border: '#f59e0b', color: '#fbbf24', bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(217, 119, 6, 0.2))' },
            { cmd: 'Open Maharashtra', border: '#f43f5e', color: '#fb7185', bg: 'linear-gradient(135deg, rgba(244, 63, 94, 0.25), rgba(225, 29, 72, 0.2))' },
            { cmd: 'Show Thanjavur district', border: '#38bdf8', color: '#7dd3fc', bg: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(2, 132, 199, 0.2))' },
            { cmd: 'Go to Coimbatore', border: '#10b981', color: '#34d399', bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(5, 150, 105, 0.2))' },
            { cmd: 'Zoom into Kumbakonam', border: '#eab308', color: '#fde047', bg: 'linear-gradient(135deg, rgba(234, 179, 8, 0.25), rgba(202, 138, 4, 0.2))' },
            { cmd: 'Show Kerala', border: '#c084fc', color: '#e879f9', bg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(147, 51, 234, 0.2))' },
          ].map((item) => (
            <button
              key={item.cmd}
              onClick={() => handleQuickCommand(item.cmd)}
              style={{
                background: item.bg,
                border: `1px solid ${item.border}`,
                borderRadius: '9999px',
                padding: '0.45rem 1.05rem',
                color: item.color,
                fontSize: '0.88rem',
                fontWeight: 900,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: `0 2px 12px ${item.border}33`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = item.border;
                e.currentTarget.style.color = '#000000';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 0 25px ${item.border}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = item.bg;
                e.currentTarget.style.color = item.color;
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = `0 2px 12px ${item.border}33`;
              }}
            >
              🎤 "{item.cmd}"
            </button>
          ))}
        </div>
      </div>

      {/* ── GEOCODED LOCATION HIERARCHY BADGE CARD ── */}
      <div style={{
        background: '#101018',
        border: '1px solid #c084fc',
        borderRadius: '18px',
        padding: '1.25rem 1.65rem',
        marginBottom: '1.4rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 25px rgba(192, 132, 252, 0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: 'linear-gradient(135deg, #a855f7 0%, #4f46e5 100%)', border: '1px solid #c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(168, 85, 247, 0.6)' }}>
            <MapPin size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: '#e879f9', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              RESOLVED HIERARCHY ({geocodedData.level})
            </div>
            <div style={{ fontSize: '1.22rem', fontWeight: 900, color: '#ffffff', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              <span style={{ color: '#fde047', fontWeight: 900 }}>India</span> <span style={{ color: '#fde047' }}>&rarr;</span>
              <span style={{ color: '#38bdf8', fontWeight: 900 }}>{geocodedData.state}</span>
              {geocodedData.district && <><span style={{ color: '#34d399' }}>&rarr;</span><span style={{ color: '#34d399', fontWeight: 900 }}>{geocodedData.district}</span></>}
              {geocodedData.block && <><span style={{ color: '#e879f9' }}>&rarr;</span><span style={{ color: '#e879f9', fontWeight: 900 }}>{geocodedData.block}</span></>}
              {geocodedData.village && <><span style={{ color: '#fb7185' }}>&rarr;</span><span style={{ color: '#fb7185', fontWeight: 900 }}>{geocodedData.village}</span></>}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#e2e8f0', marginTop: '0.25rem', fontWeight: 600 }}>
              Full Geocoded Name: {geocodedData.displayName}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right', background: '#050508', padding: '0.75rem 1.15rem', borderRadius: '14px', border: '1px solid #38bdf8', boxShadow: '0 0 18px rgba(56, 189, 248, 0.3)' }}>
          <div style={{ fontSize: '0.9rem', color: '#38bdf8', fontWeight: 900 }}>
            Lat: {geocodedData.lat.toFixed(4)} | Lon: {geocodedData.lon.toFixed(4)}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '0.2rem', fontWeight: 800 }}>
            Zoom Level: <strong style={{ color: '#e879f9', fontSize: '0.95rem' }}>{geocodedData.zoom}x</strong>
          </div>
        </div>
      </div>

      {/* ── LEAFLET SATELLITE MAP RENDERER ── */}
      <div style={{
        position: 'relative',
        height: '550px',
        width: '100%',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '2px solid #38bdf8',
        boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 35px rgba(56, 189, 248, 0.35)',
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
