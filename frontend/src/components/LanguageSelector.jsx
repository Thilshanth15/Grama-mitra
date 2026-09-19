import React, { useState, useRef, useEffect } from 'react';
import { Globe, Search, Check, ChevronDown, Info } from 'lucide-react';
import { useLanguage, LANGUAGES } from '../context/LanguageContext.jsx';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  const currentLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  const filteredLanguages = LANGUAGES.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.native.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (langCode) => {
    setLanguage(langCode);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Selector Button in Navbar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          height: '38px',
          padding: '0 0.85rem',
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: '9999px',
          color: '#ffffff',
          fontSize: '0.84rem',
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        }}
        aria-label="Select Language"
      >
        <Globe size={15} color="#34d399" />
        <span style={{ color: '#ffffff', fontWeight: 600, whiteSpace: 'nowrap' }}>
          {currentLangObj.flag} {currentLangObj.name.includes('(') ? currentLangObj.name.split(' ')[0] : currentLangObj.name}
        </span>
        <span style={{
          fontSize: '0.65rem',
          padding: '0.12rem 0.45rem',
          borderRadius: '9999px',
          background: currentLangObj.status === 'Supported' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)',
          color: currentLangObj.status === 'Supported' ? '#34d399' : '#fbbf24',
          border: currentLangObj.status === 'Supported' ? '1px solid rgba(52, 211, 153, 0.35)' : '1px solid rgba(245, 158, 11, 0.35)',
          fontWeight: 700,
          whiteSpace: 'nowrap',
        }}>
          {currentLangObj.status === 'Supported' ? 'Verified' : 'Beta'}
        </span>
        <ChevronDown size={14} color="#94a3b8" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 0.5rem)',
          right: 0,
          width: '280px',
          background: '#0d0d14',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '16px',
          boxShadow: '0 20px 40px -5px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          zIndex: 9999,
          overflow: 'hidden',
          animation: 'fadeIn 0.15s ease-out',
        }}>
          {/* Header & Search Bar */}
          <div style={{ padding: '0.85rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', background: '#07070a' }}>
            <div style={{
              fontSize: '0.725rem',
              fontWeight: 700,
              color: '#38bdf8',
              textTransform: 'uppercase',
              marginBottom: '0.6rem',
              letterSpacing: '0.06em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}>
              <span>🌐</span>
              <span>SELECT LANGUAGE / மொழி</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '10px',
              padding: '0.45rem 0.65rem',
            }}>
              <Search size={14} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search language..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.8125rem',
                  width: '100%',
                  background: 'transparent',
                  color: '#ffffff',
                }}
                autoFocus
              />
            </div>
          </div>

          {/* Language List */}
          <div style={{ maxHeight: '240px', overflowY: 'auto', padding: '0.4rem', background: '#0d0d14' }}>
            {filteredLanguages.length === 0 ? (
              <div style={{ padding: '0.85rem', fontSize: '0.8125rem', color: '#94a3b8', textAlign: 'center' }}>
                No language found
              </div>
            ) : (
              filteredLanguages.map((l) => {
                const isSelected = language === l.code;
                return (
                  <button
                    key={l.code}
                    onClick={() => handleSelectLanguage(l.code)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem 0.75rem',
                      border: isSelected ? '1px solid rgba(52, 211, 153, 0.45)' : '1px solid transparent',
                      borderRadius: '10px',
                      background: isSelected ? 'rgba(16, 185, 129, 0.18)' : 'transparent',
                      color: isSelected ? '#34d399' : '#f8fafc',
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      marginBottom: '0.2rem',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.09)';
                        e.currentTarget.style.color = '#ffffff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#f8fafc';
                      }
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '1.1rem' }}>{l.flag}</span>
                      <span style={{ color: isSelected ? '#34d399' : '#ffffff', fontWeight: 600 }}>
                        {l.name}
                      </span>
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{
                        fontSize: '0.65rem',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '9999px',
                        background: l.status === 'Supported' ? 'rgba(16, 185, 129, 0.22)' : 'rgba(255, 255, 255, 0.1)',
                        color: l.status === 'Supported' ? '#34d399' : '#cbd5e1',
                        border: l.status === 'Supported' ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(255, 255, 255, 0.15)',
                        fontWeight: 600,
                      }}>
                        {l.status}
                      </span>
                      {isSelected && <Check size={15} color="#34d399" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div style={{
            padding: '0.6rem 0.85rem',
            background: '#07070a',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.725rem',
            color: '#94a3b8',
            display: 'flex',
            gap: '0.4rem',
            alignItems: 'center',
          }}>
            <Info size={13} color="#38bdf8" style={{ flexShrink: 0 }} />
            <span>Primary support: <strong style={{ color: '#ffffff' }}>Tamil & English</strong>.</span>
          </div>
        </div>
      )}
    </div>
  );
}
