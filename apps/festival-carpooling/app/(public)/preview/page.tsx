import { Playfair_Display } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  style: ['normal', 'italic'],
})

export const metadata = { title: 'Preview · Carpooling' }

const sampleRides = [
  {
    id: '1',
    from: 'Milano',
    to: 'Festival',
    date: 'Sab 14 giu · 09:00',
    seats: 3,
    driver: 'Valentina',
    co2: '4,8 kg',
    fuel: 15,
    returnTrip: false,
  },
  {
    id: '2',
    from: 'Bologna',
    to: 'Festival',
    date: 'Sab 14 giu · 10:30',
    seats: 1,
    driver: 'Luca',
    co2: '2,9 kg',
    fuel: null,
    returnTrip: false,
  },
  {
    id: '3',
    from: 'Torino',
    to: 'Festival',
    date: 'Ven 13 giu · 15:00',
    seats: 4,
    driver: 'Sara',
    co2: null,
    fuel: 20,
    returnTrip: true,
  },
]

export default function PreviewPage() {
  return (
    <div
      className={`${playfair.variable} min-h-screen`}
      style={{
        background: '#f0ead8',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        fontFamily: 'var(--font-geist-sans), sans-serif',
      }}
    >
      {/* Grain overlay */}
      <div
        aria-hidden
        style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E")`,
        }}
      />

      <style>{`
        .ride-card { transition: transform 0.2s, box-shadow 0.2s; }
        .ride-card:hover { transform: rotate(0deg) !important; box-shadow: 4px 6px 0px rgba(34,28,17,0.1) !important; }
        .preview-link { text-decoration: none; display: block; }
      `}</style>
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── HEADER ── */}
        <header style={{
          borderBottom: '1.5px solid #d4c4a0',
          background: 'rgba(240,234,216,0.92)',
          backdropFilter: 'blur(8px)',
          position: 'sticky', top: 0, zIndex: 40,
        }}>
          <div style={{
            maxWidth: 520, margin: '0 auto',
            padding: '0 1.25rem',
            height: 56,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{
              fontFamily: 'var(--font-playfair), serif',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#2d5a27',
              letterSpacing: '-0.01em',
            }}>
              Carpooling
            </span>
            <a href="/login" style={{
              background: '#2d5a27',
              color: '#f0ead8',
              borderRadius: 999,
              padding: '0.4rem 1.1rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}>
              Accedi
            </a>
          </div>
        </header>

        {/* ── HERO ── */}
        <section style={{ maxWidth: 520, margin: '0 auto', padding: '3rem 1.25rem 2.5rem' }}>

          {/* Decorative squiggle */}
          <div style={{ marginBottom: '1.25rem' }}>
            <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
              <path d="M2 12 C8 4, 16 20, 24 12 C32 4, 40 20, 46 12" stroke="#b85c38" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            </svg>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 'clamp(2.6rem, 10vw, 3.6rem)',
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            color: '#221c11',
            marginBottom: '1rem',
            fontWeight: 700,
          }}>
            Condividi<br />
            la strada<br />
            <em style={{ color: '#2d5a27', fontStyle: 'italic' }}>per il tuo festival.</em>
          </h1>

          <p style={{ color: '#7a6b54', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem', maxWidth: 340 }}>
            Workshop, musica, radio nella natura — inizia il viaggio insieme.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a href="/rides" style={{
              background: '#221c11',
              color: '#f0ead8',
              borderRadius: 999,
              padding: '0.85rem 1.75rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            }}>
              Trova un passaggio
            </a>
            <a href="/offer" style={{
              background: 'transparent',
              color: '#2d5a27',
              border: '1.5px solid #2d5a27',
              borderRadius: 999,
              padding: '0.85rem 1.75rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}>
              Offri →
            </a>
          </div>

          {/* Little festival tags */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
            {['🌿 natura', '📻 radio', '🎵 musica', '🛠 workshop'].map((tag) => (
              <span key={tag} style={{
                background: 'rgba(45,90,39,0.1)',
                color: '#2d5a27',
                borderRadius: 999,
                padding: '0.25rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 500,
                border: '1px solid rgba(45,90,39,0.2)',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* ── ANNOUNCEMENT BANNER ── */}
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 1.25rem 2rem' }}>
          <div style={{
            background: '#b85c38',
            color: '#faf6ef',
            borderRadius: 20,
            padding: '1rem 1.25rem',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
          }}>
            <span style={{ fontSize: '1.2rem' }}>📌</span>
            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                In evidenza
              </p>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.4 }}>
                Il bus navetta non è disponibile quest'anno — organizzatevi in comitiva!
              </p>
            </div>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 1.25rem' }}>
          <WaveDivider />
        </div>

        {/* ── RIDES ── */}
        <section style={{ maxWidth: 520, margin: '0 auto', padding: '1.75rem 1.25rem 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{
              fontFamily: 'var(--font-playfair), serif',
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#221c11',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <LeafIcon /> Prossimi passaggi
            </h2>
            <a href="/rides" style={{ fontSize: '0.8rem', color: '#7a6b54', textDecoration: 'none', fontWeight: 500 }}>
              Vedi tutti →
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {sampleRides.map((ride, i) => (
              <RideCard key={ride.id} ride={ride} tilt={i % 2 === 0 ? -0.4 : 0.3} />
            ))}
          </div>
        </section>

        {/* ── WAVE DIVIDER ── */}
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 1.25rem' }}>
          <WaveDivider />
        </div>

        {/* ── IMPATTO ── */}
        <section style={{ maxWidth: 520, margin: '0 auto', padding: '1.75rem 1.25rem 6rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: '1.15rem',
            fontWeight: 700,
            color: '#221c11',
            marginBottom: '1rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <SunIcon /> Impatto della comunità
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.625rem' }}>
            <StatBlock value="24" label="passaggi condivisi" />
            <StatBlock value="61" label="persone abbinate" />
            <StatBlock value="~180 kg" label="CO₂ evitato" eco />
          </div>

          <p style={{ marginTop: '0.875rem', fontSize: '0.72rem', color: '#9a8b72', lineHeight: 1.5 }}>
            Le stime sono approssimative, basate sulle emissioni medie di un veicolo passeggeri (0,12 kg CO₂/km).
          </p>
        </section>

        {/* ── BOTTOM NAV ── */}
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: 'rgba(240,234,216,0.96)',
          backdropFilter: 'blur(10px)',
          borderTop: '1.5px solid #d4c4a0',
          zIndex: 40,
        }}>
          <div style={{
            maxWidth: 520, margin: '0 auto',
            display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
            height: 64,
          }}>
            {[
              { label: 'Home', active: true },
              { label: 'Passaggi', active: false },
              { label: 'Offri', active: false, cta: true },
              { label: 'Profilo', active: false },
            ].map(({ label, active, cta }) => (
              <button key={label} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 3, fontSize: '0.68rem', fontWeight: 600,
                color: cta ? '#f0ead8' : active ? '#221c11' : '#9a8b72',
                background: 'none', border: 'none', cursor: 'pointer',
                position: 'relative',
              }}>
                <span style={{
                  width: 36, height: 36,
                  borderRadius: cta ? 12 : 10,
                  background: cta ? '#2d5a27' : active ? 'rgba(34,28,17,0.08)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem',
                }}>
                  {label === 'Home' ? '⌂' : label === 'Passaggi' ? '🚗' : label === 'Offri' ? '+' : '◎'}
                </span>
                {label}
              </button>
            ))}
          </div>
        </nav>

      </div>
    </div>
  )
}

function RideCard({ ride, tilt }: {
  ride: typeof sampleRides[0]
  tilt: number
}) {
  return (
    <a href={`/rides/${ride.id}`} className="preview-link">
      <div className="ride-card" style={{
        background: '#faf6ef',
        border: '1.5px solid #d4c4a0',
        borderRadius: 20,
        padding: '1rem 1.1rem',
        transform: `rotate(${tilt}deg)`,
        boxShadow: '2px 3px 0px rgba(34,28,17,0.06)',
        cursor: 'pointer',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
          <div>
            {/* Route */}
            <p style={{
              fontFamily: 'var(--font-playfair), serif',
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#221c11',
              lineHeight: 1.2,
            }}>
              {ride.from}
              <span style={{ color: '#b85c38', margin: '0 0.35rem' }}>→</span>
              {ride.to}
            </p>
            {/* Date + driver */}
            <p style={{ fontSize: '0.8rem', color: '#9a8b72', marginTop: '0.25rem' }}>
              {ride.date} · {ride.driver}
            </p>
          </div>

          {/* Seats badge */}
          <span style={{
            background: ride.seats > 1 ? 'rgba(45,90,39,0.12)' : 'rgba(184,92,56,0.12)',
            color: ride.seats > 1 ? '#2d5a27' : '#b85c38',
            borderRadius: 999,
            padding: '0.2rem 0.65rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            {ride.seats} {ride.seats === 1 ? 'posto' : 'posti'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.625rem', flexWrap: 'wrap' }}>
          {ride.returnTrip && (
            <span style={{
              fontSize: '0.7rem', fontWeight: 500, color: '#7a6b54',
              border: '1px solid #c4b89a', borderRadius: 999, padding: '0.1rem 0.55rem',
            }}>
              ritorno
            </span>
          )}
          {ride.fuel && (
            <span style={{ fontSize: '0.75rem', color: '#9a8b72' }}>~€{ride.fuel} carburante</span>
          )}
          {ride.co2 && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
              fontSize: '0.72rem', fontWeight: 500, color: '#2d5a27',
              background: 'rgba(45,90,39,0.08)',
              borderRadius: 999, padding: '0.1rem 0.55rem',
            }}>
              🌿 {ride.co2} CO₂ risparmiati
            </span>
          )}
        </div>
      </div>
    </a>
  )
}

function StatBlock({ value, label, eco = false }: { value: string | number; label: string; eco?: boolean }) {
  return (
    <div style={{
      background: eco ? 'rgba(45,90,39,0.08)' : 'rgba(34,28,17,0.04)',
      border: `1.5px solid ${eco ? 'rgba(45,90,39,0.2)' : '#d4c4a0'}`,
      borderRadius: 16,
      padding: '0.875rem 0.625rem',
      textAlign: 'center',
    }}>
      <p style={{
        fontFamily: 'var(--font-playfair), serif',
        fontSize: '1.35rem',
        fontWeight: 700,
        color: eco ? '#2d5a27' : '#221c11',
        lineHeight: 1,
        marginBottom: '0.3rem',
      }}>
        {value}
      </p>
      <p style={{ fontSize: '0.68rem', color: '#9a8b72', lineHeight: 1.3, fontWeight: 500 }}>
        {label}
      </p>
    </div>
  )
}

function WaveDivider() {
  return (
    <svg width="100%" height="20" viewBox="0 0 400 20" preserveAspectRatio="none" fill="none">
      <path
        d="M0 10 C50 2, 100 18, 150 10 C200 2, 250 18, 300 10 C350 2, 380 16, 400 10"
        stroke="#d4c4a0"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  )
}

function LeafIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d5a27" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b85c38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
    </svg>
  )
}
