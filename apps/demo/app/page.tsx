"use client";
import React, { useState } from "react";
import type { IpodSong } from "react-ipod-classic";
import { FloatingIpod, Ipod } from "./components/ClientIpod";

const samplePlaylist: IpodSong[] = [
  {
    name: "Never Gonna Give You Up",
    artistName: "Rick Astley",
    albumName: "Whenever You Need Somebody",
    url: "dQw4w9WgXcQ",
  },
  {
    name: "Bohemian Rhapsody",
    artistName: "Queen",
    albumName: "A Night at the Opera",
    url: "fJ9rUzIMcZQ",
  },
  {
    name: "Feel Good Inc.",
    artistName: "Gorillaz",
    albumName: "Demon Days",
    url: "HyHNuVaZJ-k",
  },
  {
    name: "Billie Jean",
    artistName: "Michael Jackson",
    albumName: "Thriller",
    url: "Zi_XLOBDo_Y",
  },
  {
    name: "Smells Like Teen Spirit",
    artistName: "Nirvana",
    albumName: "Nevermind",
    url: "hTWKbfoikeg",
  },
];

// ---- Helpers ----

const AppleLogo = () => (
  <svg width="22" height="27" viewBox="0 0 814 1000" fill="#555">
    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-155.5-127.4C46 790.7.1 663.8.1 541.3c0-186.5 121.9-284.9 241.6-284.9 63.5 0 116.6 41.8 155.9 41.8 37.5 0 97.2-44.2 168.4-44.2 25.9 0 108.2 2.6 168.9 80.2zm-191.5-108.4c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
  </svg>
);

const styles: Record<string, React.CSSProperties> = {
  /* ── Page shell ── */
  page: {
    minHeight: "100vh",
    background: "#ffffff",
    color: "#333333",
    fontFamily: '"Lucida Grande", "Geneva", Helvetica, Arial, sans-serif',
    fontSize: "12px",
    margin: 0,
    padding: 0,
  },

  /* ── Top chrome strip ── */
  chrome: {
    background: "linear-gradient(to bottom, #d2d2d2 0%, #b4b4b4 50%, #a8a8a8 51%, #c0c0c0 100%)",
    borderBottom: "1px solid #888",
    padding: "0 10px",
    display: "flex",
    alignItems: "center",
    gap: 0,
    height: "24px",
  },
  chromeLogoWrap: {
    display: "flex",
    alignItems: "center",
    padding: "0 14px 0 4px",
    borderRight: "1px solid #999",
    height: "100%",
  },
  chromeItem: {
    padding: "0 10px",
    color: "#222",
    fontSize: "11px",
    fontWeight: 500,
    cursor: "pointer",
    textDecoration: "none",
    whiteSpace: "nowrap" as const,
    display: "flex",
    alignItems: "center",
    height: "100%",
    letterSpacing: "0.01em",
  },

  /* ── Second nav bar (sub-nav) ── */
  subNav: {
    background: "linear-gradient(to bottom, #f2f2f2 0%, #e2e2e2 100%)",
    borderBottom: "1px solid #ccc",
    display: "flex",
    gap: 0,
    padding: "0 10px",
    height: "20px",
    alignItems: "center",
  },
  subNavItem: {
    padding: "0 8px",
    fontSize: "10px",
    color: "#444",
    cursor: "pointer",
    textDecoration: "none",
    whiteSpace: "nowrap" as const,
    display: "flex",
    alignItems: "center",
    height: "100%",
  },
  subNavSep: {
    color: "#aaa",
    fontSize: "10px",
    userSelect: "none" as const,
  },

  /* ── Hero strip ── */
  hero: {
    background: "linear-gradient(to bottom, #f5f5f5 0%, #ebebeb 50%, #e0e0e0 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0",
    minHeight: "240px",
    overflow: "hidden",
    position: "relative" as const,
    borderBottom: "1px solid #ccc",
  },
  heroCopy: {
    flex: "1",
    padding: "32px 48px 32px 60px",
    maxWidth: "460px",
  },
  heroHeadline: {
    fontSize: "32px",
    fontWeight: 300,
    color: "#1a1a1a",
    margin: "0 0 6px",
    letterSpacing: "-0.5px",
    fontFamily: '"Lucida Grande", Helvetica, Arial, sans-serif',
  },
  heroSubline: {
    fontSize: "16px",
    color: "#555",
    margin: "0 0 24px",
    fontWeight: 300,
  },
  heroBtn: {
    display: "inline-block",
    padding: "5px 20px",
    background: "linear-gradient(to bottom, #7ab0e8 0%, #3f7ec9 50%, #2a67b8 51%, #3c86d4 100%)",
    color: "#fff",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: 600,
    border: "1px solid #1a55a0",
    cursor: "pointer",
    textDecoration: "none",
    boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
    letterSpacing: "0.02em",
  },
  heroImageWrap: {
    flex: "0 0 auto",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    padding: "20px 48px 0 0",
  },

  /* ── iPod SVG/graphic ── */
  ipodGraphic: {
    width: "190px",
    height: "280px",
    position: "relative" as const,
  },

  /* ── Content wrapper ── */
  contentWrap: {
    maxWidth: "760px",
    margin: "0 auto",
    padding: "0 10px",
  },

  /* ── News Headlines section ── */
  newsBar: {
    background: "linear-gradient(to bottom, #d8e4ef 0%, #c8d8ea 100%)",
    borderBottom: "1px solid #a8b8cc",
    padding: "4px 10px",
    fontSize: "11px",
    fontWeight: 700,
    color: "#1a3a6e",
    letterSpacing: "0.03em",
  },

  /* ── News cards row ── */
  newsRow: {
    display: "flex",
    gap: 0,
    borderBottom: "1px solid #ccc",
    background: "#fff",
  },
  newsCard: {
    flex: 1,
    padding: "12px 14px",
    borderRight: "1px solid #ddd",
    minHeight: "80px",
  },
  newsCardLast: {
    flex: 1,
    padding: "12px 14px",
    minHeight: "80px",
  },
  newsCardTitle: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#0062cc",
    margin: "0 0 4px",
    cursor: "pointer",
  },
  newsCardBody: {
    fontSize: "11px",
    color: "#444",
    lineHeight: 1.5,
    margin: 0,
  },

  /* ── Main 2-col layout ── */
  twoCols: {
    display: "flex",
    gap: 0,
    alignItems: "flex-start",
    background: "#fff",
  },
  mainCol: {
    flex: "1",
    padding: "16px 20px",
    borderRight: "1px solid #ddd",
  },
  sideCol: {
    width: "200px",
    flexShrink: 0,
    padding: "16px 14px",
    background: "#f5f8fc",
    borderLeft: "1px solid #ddd",
  },

  /* ── Section heading ── */
  sectionHeading: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#1a3a6e",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    margin: "0 0 10px",
    paddingBottom: "4px",
    borderBottom: "1px solid #ccc",
  },

  /* ── Promo box ── */
  promoBox: {
    background: "linear-gradient(135deg, #e8f0fa 0%, #d0e2f4 100%)",
    border: "1px solid #a8c0e0",
    borderRadius: "4px",
    padding: "14px",
    marginBottom: "16px",
  },
  promoTitle: {
    fontSize: "15px",
    fontWeight: 700,
    color: "#1a1a1a",
    margin: "0 0 4px",
    letterSpacing: "-0.3px",
  },
  promoBody: {
    fontSize: "11px",
    color: "#444",
    lineHeight: 1.6,
    margin: "0 0 10px",
  },

  /* ── Code blocks ── */
  codePre: {
    background: "#f0f4f8",
    border: "1px solid #ccc",
    borderRadius: "3px",
    padding: "10px 12px",
    fontSize: "11px",
    fontFamily: '"Monaco", "Courier New", monospace',
    color: "#1a1a1a",
    overflowX: "auto" as const,
    lineHeight: 1.6,
    margin: "8px 0",
  },

  /* ── Sidebar items ── */
  sideItem: {
    marginBottom: "14px",
    paddingBottom: "12px",
    borderBottom: "1px solid #ddd",
  },
  sideItemTitle: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#0062cc",
    margin: "0 0 3px",
    cursor: "pointer",
  },
  sideItemBody: {
    fontSize: "10px",
    color: "#555",
    lineHeight: 1.5,
    margin: 0,
  },

  /* ── Badge ── */
  badge: {
    display: "inline-block",
    background: "#0062cc",
    color: "#fff",
    fontSize: "9px",
    fontWeight: 700,
    padding: "1px 5px",
    borderRadius: "2px",
    letterSpacing: "0.05em",
    marginLeft: "4px",
  },

  /* ── iPod Demo section ── */
  demoSection: {
    background: "linear-gradient(to bottom, #f0f0f0 0%, #e4e4e4 100%)",
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "16px",
    marginBottom: "16px",
  },
  demoRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap" as const,
    marginBottom: "10px",
    alignItems: "flex-end",
  },
  demoLabel: {
    fontSize: "10px",
    color: "#444",
    marginBottom: "3px",
    display: "block",
    fontWeight: 600,
  },
  demoSelect: {
    padding: "3px 6px",
    fontSize: "11px",
    border: "1px solid #aaa",
    borderRadius: "3px",
    background: "linear-gradient(to bottom, #fff 0%, #f0f0f0 100%)",
    color: "#222",
    outline: "none",
    cursor: "pointer",
  },
  demoBtn: {
    padding: "4px 14px",
    fontSize: "11px",
    fontWeight: 600,
    border: "1px solid #888",
    borderRadius: "10px",
    background: "linear-gradient(to bottom, #f0f0f0 0%, #d8d8d8 100%)",
    color: "#222",
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
  },
  demoBtnActive: {
    background: "linear-gradient(to bottom, #6090d0 0%, #3060b0 100%)",
    color: "#fff",
    border: "1px solid #2050a0",
  },
};

/* ── Inline iPod SVG illustration (Classic 1st-gen white iPod) ── */
const IpodIllustration = () => (
  <svg viewBox="0 0 190 310" width="190" height="310" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Body */}
    <rect x="20" y="10" width="150" height="250" rx="22" fill="url(#bodyGrad)" />
    <rect x="20" y="10" width="150" height="250" rx="22" stroke="#bbb" strokeWidth="1" />
    {/* Body gradient */}
    <defs>
      <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#f5f5f5" />
        <stop offset="40%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#d8d8d8" />
      </linearGradient>
      <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#c8d8e8" />
        <stop offset="100%" stopColor="#9db8d4" />
      </linearGradient>
      <linearGradient id="wheelGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e8e8e8" />
        <stop offset="100%" stopColor="#c8c8c8" />
      </linearGradient>
    </defs>
    {/* Screen bezel */}
    <rect x="38" y="30" width="114" height="88" rx="6" fill="#2a2a2a" />
    {/* Screen */}
    <rect x="41" y="33" width="108" height="82" rx="4" fill="url(#screenGrad)" />
    {/* Screen content lines */}
    <rect x="50" y="44" width="90" height="8" rx="2" fill="#1a3a6e" opacity="0.7" />
    <rect x="50" y="57" width="70" height="4" rx="1" fill="#fff" opacity="0.5" />
    <rect x="50" y="65" width="80" height="4" rx="1" fill="#fff" opacity="0.3" />
    <rect x="50" y="73" width="60" height="4" rx="1" fill="#fff" opacity="0.3" />
    <rect x="50" y="81" width="75" height="4" rx="1" fill="#fff" opacity="0.3" />
    <rect x="50" y="89" width="40" height="4" rx="1" fill="#fff" opacity="0.3" />
    {/* Click wheel */}
    <circle cx="95" cy="195" r="52" fill="url(#wheelGrad)" stroke="#aaa" strokeWidth="1" />
    <circle cx="95" cy="195" r="20" fill="#e0e0e0" stroke="#bbb" strokeWidth="1" />
    {/* Wheel text: MENU at top */}
    <text x="95" y="155" textAnchor="middle" fontSize="8" fill="#555" fontFamily="Helvetica, Arial, sans-serif" fontWeight="bold">MENU</text>
    {/* Skip back (left) */}
    <polygon points="72,192 80,187 80,197" fill="#666" />
    <polygon points="72,192 76,187 76,197" fill="#888" />
    {/* Skip forward (right) */}
    <polygon points="118,192 110,187 110,197" fill="#666" />
    <polygon points="118,192 114,187 114,197" fill="#888" />
    {/* Play/pause (bottom) */}
    <polygon points="92,218 100,218 96,224" fill="#666" />
    <rect x="90" y="218" width="3" height="6" fill="#666" />
    <rect x="94" y="218" width="3" height="6" fill="#666" />
    {/* Top headphone jack */}
    <ellipse cx="65" cy="10" rx="5" ry="3" fill="#999" />
    {/* Hold switch */}
    <rect x="85" y="8" width="20" height="4" rx="2" fill="#ccc" />
    {/* Bottom connector */}
    <rect x="70" y="258" width="50" height="6" rx="2" fill="#aaa" />
    {/* Earbuds cable */}
    <path d="M65 10 Q40 40 30 100 Q20 150 25 200" stroke="#ccc" strokeWidth="2" fill="none" strokeLinecap="round" />
    <circle cx="22" cy="207" r="6" fill="#ddd" stroke="#bbb" strokeWidth="1" />
    <path d="M65 10 Q90 50 95 80" stroke="#ccc" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="2 2" />
    {/* Shine overlay */}
    <ellipse cx="80" cy="130" rx="30" ry="60" fill="white" opacity="0.08" transform="rotate(-20 80 130)" />
  </svg>
);

export default function Page() {
  const [position, setPosition] = useState<
    "bottom-right" | "bottom-left" | "top-right" | "top-left"
  >("bottom-right");
  const [theme, setTheme] = useState<"black" | "silver" | "u2" | "mnelia">("silver");
  const [showEmbedded, setShowEmbedded] = useState(false);

  return (
    <div style={styles.page}>
      {/* ── Top chrome nav (Apple-style) ── */}
      <nav style={styles.chrome}>
        <div style={styles.chromeLogoWrap}>
          <AppleLogo />
        </div>
        {["Store", "iTools", "iCards", "QuickTime", "Support", "Mac OS X"].map((item) => (
          <span key={item} style={styles.chromeItem}>{item}</span>
        ))}
      </nav>

      {/* ── Sub-navigation ── */}
      <nav style={styles.subNav}>
        {["Hot News", "Hardware", "Software", "Made4Mac", "Education", "Creative", "Smallbiz", "Developer"].map((item, i, arr) => (
          <React.Fragment key={item}>
            <span style={styles.subNavItem}>{item}</span>
            {i < arr.length - 1 && <span style={styles.subNavSep}>|</span>}
          </React.Fragment>
        ))}
        <span style={{ flex: 1 }} />
        <span style={styles.subNavItem}>Where to Buy</span>
      </nav>

      {/* ── Hero ── */}
      <section style={styles.hero}>
        {/* Left: iPod SVG */}
        <div style={styles.heroImageWrap}>
          <IpodIllustration />
        </div>

        {/* Right: Copy */}
        <div style={styles.heroCopy}>
          <h1 style={styles.heroHeadline}>
            Say hello to iPod.js
          </h1>
          <p style={styles.heroSubline}>
            1,000 songs in your pocket — now on any website.
          </p>
          <p style={{ fontSize: "12px", color: "#555", margin: "0 0 20px", lineHeight: 1.6 }}>
            Coloca um iPod Classic interativo e funcional em qualquer site React.
            Funciona como widget flutuante ou componente embutido, com playlist
            customizada via JSON ou props.
          </p>
          <a
            href="#demo"
            style={styles.heroBtn}
            onClick={(e) => { e.preventDefault(); setShowEmbedded(true); document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" }); }}
          >
            Experimentar Demo
          </a>
        </div>
      </section>

      {/* ── News headlines bar ── */}
      <div style={styles.newsBar}>Hot News Headlines</div>

      {/* ── 4-column news cards ── */}
      <div style={styles.newsRow}>
        <div style={styles.newsCard}>
          <p style={styles.newsCardTitle}>💿 iTunes 2</p>
          <p style={styles.newsCardBody}>
            Stream with iPod Mini Hardware. Cross-fade, Sound Enhancer, Smart Playlists & more.
          </p>
        </div>
        <div style={styles.newsCard}>
          <p style={styles.newsCardTitle}>📱 Your life. To go.</p>
          <p style={styles.newsCardBody}>
            The new iBook. Now 600Mhz. The thinnest, lightest laptop you can take anywhere.
          </p>
        </div>
        <div style={styles.newsCard}>
          <p style={styles.newsCardTitle}>⚡ Breakthrough</p>
          <p style={styles.newsCardBody}>
            Mac OS X 10.2 is here. Up to 40% faster applications performance. Free upgrade.
          </p>
        </div>
        <div style={styles.newsCardLast}>
          <p style={styles.newsCardTitle}>🚀 Move fast.</p>
          <p style={styles.newsCardBody}>
            The new 667MHz Titanium PowerBook G4 with CD-RW is the fastest notebook ever.
          </p>
        </div>
      </div>

      {/* ── 2-column main content ── */}
      <div style={styles.twoCols}>

        {/* ── Main column ── */}
        <main style={styles.mainCol} id="demo">

          {/* Demo promo box */}
          <div style={styles.promoBox}>
            <p style={styles.promoTitle}>🎛️ Demo Interativo</p>
            <p style={styles.promoBody}>
              Experimenta o componente em tempo real. Ajusta a posição, o tema e alterna entre o modo flutuante e embutido.
            </p>

            {/* Controls */}
            <div style={styles.demoRow}>
              <div>
                <label style={styles.demoLabel}>Posição do Floating iPod</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value as any)}
                  style={styles.demoSelect}
                >
                  <option value="bottom-right">Inferior Direito</option>
                  <option value="bottom-left">Inferior Esquerdo</option>
                  <option value="top-right">Superior Direito</option>
                  <option value="top-left">Superior Esquerdo</option>
                </select>
              </div>
              <div>
                <label style={styles.demoLabel}>Tema do iPod</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as any)}
                  style={styles.demoSelect}
                >
                  <option value="silver">Silver Classic</option>
                  <option value="black">Black Classic</option>
                  <option value="u2">Special U2 Edition</option>
                  <option value="mnelia">Mnelia Gradient</option>
                </select>
              </div>
              <div>
                <label style={styles.demoLabel}>&nbsp;</label>
                <button
                  onClick={() => setShowEmbedded(!showEmbedded)}
                  style={{ ...styles.demoBtn, ...(showEmbedded ? styles.demoBtnActive : {}) }}
                >
                  {showEmbedded ? "Ocultar Modo Embutido" : "Ver Modo Embutido"}
                </button>
              </div>
            </div>
          </div>

          {/* Embedded iPod */}
          {showEmbedded && (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "16px 0",
              padding: "20px",
              background: "linear-gradient(to bottom, #e8e8e8, #d0d0d0)",
              border: "1px solid #bbb",
              borderRadius: "4px",
            }}>
              <p style={{ margin: "0 0 12px", fontWeight: 700, fontSize: "11px", color: "#333" }}>
                Modo Embutido — &lt;Ipod /&gt;
              </p>
              <div style={{ width: "370px", height: "620px" }}>
                <Ipod songs={samplePlaylist} theme={theme} showReflection={true} />
              </div>
            </div>
          )}

          {/* Code section */}
          <h3 style={styles.sectionHeading}>Como usar no teu site</h3>

          <p style={{ fontSize: "11px", color: "#444", margin: "0 0 6px", lineHeight: 1.6 }}>
            <strong>1.</strong> Instala o pacote:
          </p>
          <pre style={styles.codePre}>npm install react-ipod-classic</pre>

          <p style={{ fontSize: "11px", color: "#444", margin: "10px 0 6px", lineHeight: 1.6 }}>
            <strong>2.</strong> Adiciona o componente ao teu site (JSX):
          </p>
          <pre style={styles.codePre}>{`import { FloatingIpod } from 'react-ipod-classic';

export default function MySite() {
  const songs = [
    {
      name: "Never Gonna Give You Up",
      artistName: "Rick Astley",
      url: "dQw4w9WgXcQ", // YouTube Video ID
    },
    {
      name: "Bohemian Rhapsody",
      artistName: "Queen",
      url: "fJ9rUzIMcZQ",
    }
  ];

  return (
    <div>
      {/* O teu site aqui */}
      <FloatingIpod
        songs={songs}
        position="bottom-right"
        theme="silver"
        defaultOpen={false}
      />
    </div>
  );
}`}</pre>

          <p style={{ fontSize: "11px", color: "#444", margin: "10px 0 6px", lineHeight: 1.6 }}>
            <strong>3.</strong> Ou carrega via ficheiro JSON remoto:
          </p>
          <pre style={styles.codePre}>{`<FloatingIpod
  songsUrl="/demo-songs.json"
  position="bottom-right"
/>`}</pre>

          <h3 style={{ ...styles.sectionHeading, marginTop: "20px" }}>Props disponíveis</h3>
          <table style={{ fontSize: "11px", width: "100%", borderCollapse: "collapse" as const }}>
            <thead>
              <tr style={{ background: "#e8eef6" }}>
                {["Prop", "Tipo", "Descrição"].map((h) => (
                  <th key={h} style={{ padding: "5px 8px", textAlign: "left", border: "1px solid #ccc", fontWeight: 700, color: "#1a3a6e" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["songs", "IpodSong[]", "Lista de músicas (YouTube ID ou URL)"],
                ["songsUrl", "string", "URL remoto de um JSON com músicas"],
                ["position", "string", "bottom-right | bottom-left | top-right | top-left"],
                ["theme", "string", "silver | black | u2 | mnelia"],
                ["defaultOpen", "boolean", "Se o widget começa aberto (padrão: false)"],
                ["showReflection", "boolean", "Reflexo espelhado abaixo do iPod"],
                ["onSongChange", "function", "Callback quando a música muda"],
              ].map(([prop, type, desc]) => (
                <tr key={prop} style={{ borderBottom: "1px solid #e0e0e0" }}>
                  <td style={{ padding: "5px 8px", border: "1px solid #ddd", fontFamily: "monospace", color: "#0062cc", fontWeight: 600 }}>{prop}</td>
                  <td style={{ padding: "5px 8px", border: "1px solid #ddd", fontFamily: "monospace", color: "#666" }}>{type}</td>
                  <td style={{ padding: "5px 8px", border: "1px solid #ddd", color: "#444" }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>

        {/* ── Sidebar ── */}
        <aside style={styles.sideCol}>
          <h4 style={styles.sectionHeading}>react-ipod-classic</h4>

          <div style={styles.sideItem}>
            <p style={styles.sideItemTitle}>
              Floating Widget <span style={styles.badge}>NEW</span>
            </p>
            <p style={styles.sideItemBody}>
              O iPod aparece flutuante no canto do teu site. O visitante controla o play/pause e a música.
            </p>
          </div>

          <div style={styles.sideItem}>
            <p style={styles.sideItemTitle}>ClickWheel 360°</p>
            <p style={styles.sideItemBody}>
              A roda tátil funciona com movimentos circulares reais — volume, listas, coverflow.
            </p>
          </div>

          <div style={styles.sideItem}>
            <p style={styles.sideItemTitle}>YouTube integrado</p>
            <p style={styles.sideItemBody}>
              Passa um YouTube Video ID e o iPod reproduz o áudio automaticamente.
            </p>
          </div>

          <div style={styles.sideItem}>
            <p style={styles.sideItemTitle}>4 Temas incluídos</p>
            <p style={styles.sideItemBody}>
              Silver, Black, U2 Special Edition e Mnelia Gradient.
            </p>
          </div>

          <div style={styles.sideItem}>
            <p style={styles.sideItemTitle}>TypeScript nativo</p>
            <p style={styles.sideItemBody}>
              100% tipado, tipos exportados para props e callbacks.
            </p>
          </div>

          <div style={{ ...styles.sideItem, borderBottom: "none" }}>
            <p style={styles.sideItemTitle}>Open Source</p>
            <p style={styles.sideItemBody}>
              Código aberto no GitHub. MIT License.{" "}
              <a href="https://github.com/gajonormal/ipod-classic-revamped" target="_blank" rel="noreferrer" style={{ color: "#0062cc" }}>
                Ver repositório →
              </a>
            </p>
          </div>

          {/* Mini iPod promo */}
          <div style={{
            background: "linear-gradient(135deg, #1a3a6e 0%, #2a5fbb 100%)",
            borderRadius: "4px",
            padding: "12px",
            color: "#fff",
            marginTop: "8px",
            textAlign: "center" as const,
          }}>
            <p style={{ fontSize: "13px", fontWeight: 700, margin: "0 0 4px" }}>
              🎵 iPod.js
            </p>
            <p style={{ fontSize: "10px", margin: "0 0 10px", opacity: 0.85 }}>
              O iPod Classic que cabe em qualquer site React.
            </p>
            <a
              href="https://github.com/gajonormal/ipod-classic-revamped"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                padding: "4px 14px",
                background: "#fff",
                color: "#1a3a6e",
                borderRadius: "10px",
                fontSize: "10px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              GitHub →
            </a>
          </div>
        </aside>
      </div>

      {/* ── Footer ── */}
      <footer style={{
        background: "linear-gradient(to bottom, #d8d8d8 0%, #c0c0c0 100%)",
        borderTop: "1px solid #aaa",
        padding: "12px 20px",
        textAlign: "center" as const,
        fontSize: "10px",
        color: "#555",
      }}>
        <p style={{ margin: "0 0 4px" }}>
          Copyright © 2024 iPod.js — Open Source Project by{" "}
          <a href="https://github.com/gajonormal" target="_blank" rel="noreferrer" style={{ color: "#0062cc" }}>gajonormal</a>
          {" "}· Based on original work by{" "}
          <a href="http://tannerv.com" target="_blank" rel="noreferrer" style={{ color: "#0062cc" }}>Tanner Villarete</a>
        </p>
        <p style={{ margin: 0, color: "#888" }}>
          Este site não é afiliado à Apple Inc. · iPod é marca registada da Apple Inc.
        </p>
      </footer>

      {/* ── Floating iPod ── */}
      <FloatingIpod
        songs={samplePlaylist}
        position={position}
        theme={theme}
        defaultOpen={false}
      />
    </div>
  );
}
