'use client'

import { useState } from 'react'

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const MONTHS_FULL  = ['January','February','March','April','May','June','July','August','September','October','November','December']

// Prototype — raw HTML, no external deps, minimal functionality
export default function DatePickerPrototype() {
  const [month, setMonth]   = useState(5)     // June (0-indexed)
  const [year, setYear]     = useState(2026)
  const [week, setWeek]     = useState(23)
  const [dialog, setDialog] = useState<'month' | 'year' | 'week' | null>(null)

  const close = () => setDialog(null)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', background: '#f8f8f8' }}>

      <p style={{ fontSize: '11px', color: '#aaa', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>Period Navigator</p>

      {/* ── Navigator Bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'white', border: '1px solid #e8e8e8', borderRadius: '12px', padding: '10px 14px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>

        <button onClick={() => setWeek(w => Math.max(1, w - 1))} style={navBtnStyle}>‹</button>

        <span onClick={() => setDialog('month')} style={chipStyle}>{MONTHS_FULL[month]}</span>
        <span style={{ color: '#ddd', userSelect: 'none' }}>·</span>
        <span onClick={() => setDialog('week')}  style={chipStyle}>Week {week}</span>
        <span style={{ color: '#ddd', userSelect: 'none' }}>·</span>
        <span onClick={() => setDialog('year')}  style={chipStyle}>{year}</span>

        <button onClick={() => setWeek(w => Math.min(52, w + 1))} style={navBtnStyle}>›</button>

      </div>


      {/* ── Dialogs ── */}
      {dialog && (
        <div onClick={close} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 12px 40px rgba(0,0,0,0.14)' }}>

            {/* Month Picker — 3×4 grid of abbreviations */}
            {dialog === 'month' && (
              <>
                <p style={dialogLabelStyle}>Month</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', width: '210px' }}>
                  {MONTHS_SHORT.map((m, i) => (
                    <button key={m} onClick={() => { setMonth(i); close() }} style={{
                      ...gridCellStyle,
                      background: i === month ? '#111' : '#f5f5f5',
                      color:      i === month ? 'white' : '#333',
                    }}>
                      {m}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Year Spindle — scrollable drum with perspective scale + opacity */}
            {dialog === 'year' && (
              <>
                <p style={dialogLabelStyle}>Year</p>
                <div style={{ width: '120px', height: '220px', position: 'relative', overflow: 'hidden' }}>
                  {/* Selection band */}
                  <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '38px', transform: 'translateY(-50%)', border: '1px solid #e0e0e0', borderRadius: '8px', pointerEvents: 'none', zIndex: 1 }} />
                  <div style={{ overflowY: 'scroll', height: '100%', scrollbarWidth: 'none' as const }}>
                    <div style={{ height: '91px' }} />
                    {Array.from({ length: 30 }, (_, i) => 2026 - i).map(y => {
                      const dist = Math.abs(y - year)
                      return (
                        <div key={y} onClick={() => { setYear(y); close() }} style={{
                          textAlign: 'center', padding: '5px 0', cursor: 'pointer',
                          transform:  `scale(${Math.max(0.5, 1 - dist * 0.13)})`,
                          opacity:    Math.max(0.15, 1 - dist * 0.28),
                          fontWeight: y === year ? '700' : '400',
                          fontSize:   y === year ? '18px' : '14px',
                          color:      y === year ? '#111' : '#555',
                        }}>
                          {y}
                        </div>
                      )
                    })}
                    <div style={{ height: '91px' }} />
                  </div>
                </div>
              </>
            )}

            {/* Week Calendar — lo-fi week rows: W## · dot ——————— */}
            {dialog === 'week' && (
              <>
                <p style={dialogLabelStyle}>{MONTHS_FULL[month]} {year}</p>
                <div style={{ width: '270px' }}>
                  {[21, 22, 23, 24, 25].map(w => (
                    <div key={w} onClick={() => { setWeek(w); close() }} style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '10px 8px', cursor: 'pointer', borderRadius: '8px',
                      background: w === week ? '#f5f5f5' : 'transparent',
                    }}>
                      {/* Week number */}
                      <span style={{ width: '32px', fontSize: '11px', color: '#aaa', fontWeight: '600', letterSpacing: '0.04em' }}>W{w}</span>
                      {/* Monday dot */}
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: w === week ? '#111' : '#ccc', flexShrink: 0 }} />
                      {/* Week span line */}
                      <div style={{ flex: 1, height: '2px', background: w === week ? '#111' : '#ddd', borderRadius: '2px' }} />
                    </div>
                  ))}
                </div>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  )
}

const chipStyle: React.CSSProperties    = { cursor: 'pointer', padding: '4px 10px', borderRadius: '6px', fontWeight: '600', fontSize: '15px', color: '#111', userSelect: 'none', letterSpacing: '-0.01em' }
const navBtnStyle: React.CSSProperties  = { background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', color: '#bbb', padding: '0 4px', lineHeight: 1, userSelect: 'none' }
const dialogLabelStyle: React.CSSProperties = { margin: '0 0 16px', fontWeight: '600', fontSize: '11px', color: '#aaa', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }
const gridCellStyle: React.CSSProperties = { padding: '9px 0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', transition: 'all 0.1s' }
