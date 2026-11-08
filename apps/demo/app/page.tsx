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

const AppleLogo = ({ color = "#f5f5f5" }: { color?: string }) => (
  <svg width="18" height="22" viewBox="0 0 814 1000" fill={color}>
    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-155.5-127.4C46 790.7.1 663.8.1 541.3c0-186.5 121.9-284.9 241.6-284.9 63.5 0 116.6 41.8 155.9 41.8 37.5 0 97.2-44.2 168.4-44.2 25.9 0 108.2 2.6 168.9 80.2zm-191.5-108.4c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
  </svg>
);

export default function Page() {
  const [position, setPosition] = useState<
    "bottom-right" | "bottom-left" | "top-right" | "top-left"
  >("bottom-right");
  const [theme, setTheme] = useState<"black" | "silver" | "u2" | "mnelia">("silver");
  const [showEmbedded, setShowEmbedded] = useState(false);

  return (
    <div style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', margin: 0, padding: 0, background: "#fff", color: "#333" }}>

      {/* ── Top navigation bar ── */}
      <nav style={{
        background: "linear-gradient(to bottom, #666 0%, #3d3d3d 48%, #333 49%, #2a2a2a 100%)",
        display: "flex",
        alignItems: "center",
        height: "30px",
        padding: "0 10px",
        gap: 0,
        borderBottom: "1px solid #111",
        position: "sticky" as const,
        top: 0,
        zIndex: 1000,
      }}>
        {/* Apple logo */}
        <div style={{ padding: "0 14px", borderRight: "1px solid #555", height: "100%", display: "flex", alignItems: "center" }}>
          <AppleLogo />
        </div>

        {["Store", "Mac", "iPod + iTunes", "iPhone", "Downloads", "Support"].map((item, i) => (
          <span
            key={item}
            style={{
              padding: "0 12px",
              height: "100%",
              display: "flex",
              alignItems: "center",
              fontSize: "12px",
              fontWeight: i === 2 ? 700 : 400,
              color: i === 2 ? "#fff" : "#ccc",
              cursor: "pointer",
              background: i === 2
                ? "linear-gradient(to bottom, #7a7a7a 0%, #555 48%, #444 49%, #3a3a3a 100%)"
                : "transparent",
              borderLeft: i === 2 ? "1px solid #666" : "none",
              borderRight: i === 2 ? "1px solid #666" : "none",
            }}
          >
            {item}
          </span>
        ))}

        {/* Search */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search"
            style={{
              height: "17px",
              width: "140px",
              borderRadius: "9px",
              border: "none",
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              fontSize: "11px",
              padding: "0 10px",
              outline: "none",
            }}
          />
        </div>
      </nav>

      {/* ── iPod + iTunes sub-header with product icons ── */}
      <div style={{
        background: "linear-gradient(to bottom, #2c2c2c 0%, #1a1a1a 100%)",
        borderBottom: "1px solid #000",
        padding: "12px 0 0",
      }}>
        {/* Title row */}
        <div style={{ maxWidth: "980px", margin: "0 auto", padding: "0 20px 10px" }}>
          <span style={{ fontSize: "24px", color: "#fff", fontWeight: 300, letterSpacing: "-0.5px" }}>
            iPod
          </span>
        </div>

        {/* Product tabs row */}
        <div style={{
          maxWidth: "980px",
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          gap: "30px",
        }}>
          {["iPod shuffle", "iPod nano", "iPod", "Apple TV", "iTunes"].map((p, i) => (
            <div key={p} style={{
              display: "flex",
              flexDirection: "column" as const,
              alignItems: "center",
              gap: "4px",
              opacity: i === 2 ? 1 : 0.6,
              cursor: "pointer",
            }}>
              <div style={{
                width: "36px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
              }}>
                {["🔊", "📱", "🎵", "📺", "🎼"][i]}
              </div>
              <span style={{
                fontSize: "11px",
                color: i === 2 ? "#fff" : "#aaa",
                fontWeight: i === 2 ? 700 : 400,
                borderBottom: i === 2 ? "2px solid #fff" : "none",
                paddingBottom: "6px",
              }}>{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tab nav (Overview, Features, etc.) ── */}
      <div style={{
        background: "linear-gradient(to bottom, #4a4a4a 0%, #3a3a3a 100%)",
        borderBottom: "1px solid #222",
      }}>
        <div style={{
          maxWidth: "980px",
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          height: "32px",
          gap: 0,
        }}>
          {["Overview", "Features", "Sync with iTunes", "Accessories", "Car Integration", "Tech Specs"].map((tab, i) => (
            <span key={tab} style={{
              padding: "0 14px",
              height: "100%",
              display: "flex",
              alignItems: "center",
              fontSize: "12px",
              color: i === 0 ? "#fff" : "#aaa",
              fontWeight: i === 0 ? 700 : 400,
              borderBottom: i === 0 ? "2px solid #76b9e8" : "none",
              cursor: "pointer",
            }}>{tab}</span>
          ))}

          <div style={{ marginLeft: "auto" }}>
            <span style={{
              display: "inline-block",
              padding: "4px 20px",
              background: "linear-gradient(to bottom, #76b9e8 0%, #2d7cba 50%, #1e68a8 51%, #3490cf 100%)",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 700,
              borderRadius: "12px",
              border: "1px solid #0a5a9e",
              cursor: "pointer",
            }}>Buy Now</span>
          </div>
        </div>
      </div>

      {/* ── Hero section (dark, full-width) ── */}
      <section style={{
        background: "linear-gradient(to bottom, #1c1c1c 0%, #111 60%, #0a0a0a 100%)",
        padding: "50px 20px 60px",
        textAlign: "center" as const,
        borderBottom: "1px solid #000",
      }}>
        <h1 style={{
          fontSize: "34px",
          fontWeight: 300,
          color: "#f5f5f5",
          margin: "0 0 10px",
          letterSpacing: "-0.5px",
          lineHeight: 1.2,
        }}>
          Songs, playlists, and music — in your browser.
        </h1>
        <h2 style={{
          fontSize: "34px",
          fontWeight: 700,
          color: "#fff",
          margin: "0 0 32px",
          letterSpacing: "-0.5px",
          lineHeight: 1.2,
        }}>
          Now playing on <em style={{ fontStyle: "italic" }}>any website</em> near you.
        </h2>
        <p style={{ color: "#999", fontSize: "14px", maxWidth: "540px", margin: "0 auto 36px", lineHeight: 1.7 }}>
          react-ipod-classic brings a fully functional iPod Classic to your React site — with a 360° ClickWheel,
          YouTube playback, 4 themes, and a floating widget anyone can use.
        </p>
        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" as const }}>
          <span style={{
            display: "inline-block",
            padding: "8px 28px",
            background: "linear-gradient(to bottom, #76b9e8 0%, #2d7cba 50%, #1e68a8 51%, #3490cf 100%)",
            color: "#fff",
            fontSize: "13px",
            fontWeight: 700,
            borderRadius: "14px",
            border: "1px solid #0a5a9e",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
          }}
            onClick={() => { setShowEmbedded(true); document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" }); }}
          >
            Ver Demo
          </span>
          <a
            href="https://github.com/gajonormal/ipod-classic-revamped"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              padding: "8px 28px",
              background: "linear-gradient(to bottom, #666 0%, #444 50%, #333 51%, #444 100%)",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 700,
              borderRadius: "14px",
              border: "1px solid #222",
              cursor: "pointer",
              textDecoration: "none",
              boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            GitHub →
          </a>
        </div>
      </section>

      {/* ── Sliding iPod screens strip ── */}
      <section style={{
        background: "linear-gradient(to bottom, #0a0a0a 0%, #1a1a1a 100%)",
        padding: "30px 20px",
        borderBottom: "1px solid #333",
        overflow: "hidden",
      }}>
        <div style={{
          maxWidth: "980px",
          margin: "0 auto",
          display: "flex",
          gap: "16px",
          justifyContent: "center",
          flexWrap: "wrap" as const,
        }}>
          {[
            { label: "1,000+ músicas", icon: "🎵", desc: "Passa YouTube ID ou URL" },
            { label: "ClickWheel 360°", icon: "🌀", desc: "Roda contínua como o iPod real" },
            { label: "4 Temas", icon: "🎨", desc: "Silver, Black, U2, Mnelia" },
            { label: "Widget Flutuante", icon: "🪟", desc: "Coloca em qualquer site" },
            { label: "TypeScript", icon: "📝", desc: "100% tipado, pronto para prod" },
          ].map((card) => (
            <div
              key={card.label}
              style={{
                width: "160px",
                background: "linear-gradient(to bottom, #2a2a2a 0%, #1e1e1e 100%)",
                border: "1px solid #3a3a3a",
                borderRadius: "8px",
                padding: "20px 14px",
                textAlign: "center" as const,
                boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "10px" }}>{card.icon}</div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>{card.label}</div>
              <div style={{ fontSize: "10px", color: "#888", lineHeight: 1.5 }}>{card.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── White content section ── */}
      <section style={{ background: "#fff", padding: "0 20px 40px", borderBottom: "1px solid #ccc" }}>
        <div style={{ maxWidth: "980px", margin: "0 auto" }}>

          {/* Two-col layout */}
          <div style={{ display: "flex", gap: "40px", paddingTop: "40px", alignItems: "flex-start" }}>

            {/* Left col — text features */}
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "18px", fontWeight: 300, color: "#1a1a1a", margin: "0 0 6px", letterSpacing: "-0.3px" }}>
                Coloca um iPod no teu site.
              </h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, margin: "0 0 20px" }}>
                Com todas as músicas ao alcance, qualquer visitante pode controlar o iPod no teu site — fazer play, pause, navegar nas listas e ajustar o volume usando a ClickWheel circular, como no iPod real.
              </p>
              <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#0073e6", margin: "0 0 6px" }}>
                Play all day
              </h4>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, margin: "0 0 20px" }}>
                O componente carrega músicas via YouTube Video ID — sem ficheiros de áudio, sem hosting próprio. Passa o ID no prop <code style={{ background: "#f0f0f0", padding: "1px 5px", borderRadius: "3px", fontSize: "12px" }}>url</code> e o iPod trata do resto.
              </p>
              <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#0073e6", margin: "0 0 6px" }}>
                Pack light
              </h4>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, margin: "0 0 20px" }}>
                Zero dependências de assets externos — todos os ícones, texturas e estilos estão embutidos no pacote como data URIs. Instala e funciona.
              </p>
              <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#0073e6", margin: "0 0 6px" }}>
                Search and enjoy
              </h4>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, margin: 0 }}>
                Carrega listas de músicas via props, array JSON embutido, ou URL remota com <code style={{ background: "#f0f0f0", padding: "1px 5px", borderRadius: "3px", fontSize: "12px" }}>songsUrl</code>. Playlists, albums e artistas também suportados.
              </p>
            </div>

            {/* Right col — 80GB badge + feature list */}
            <div style={{ width: "280px", flexShrink: 0 }}>
              <div style={{
                background: "linear-gradient(135deg, #f0f4f8 0%, #e2eaf4 100%)",
                border: "1px solid #c0d0e0",
                borderRadius: "8px",
                padding: "20px",
                marginBottom: "20px",
              }}>
                <div style={{
                  background: "linear-gradient(to bottom, #555 0%, #333 100%)",
                  color: "#fff",
                  fontSize: "22px",
                  fontWeight: 700,
                  borderRadius: "6px",
                  padding: "8px 14px",
                  display: "inline-block",
                  marginBottom: "12px",
                  letterSpacing: "-0.5px",
                }}>npm</div>
                <p style={{ fontSize: "12px", color: "#444", margin: "0 0 10px", lineHeight: 1.6 }}>
                  Disponível no npm. Instala em segundos no teu projeto React.
                </p>
                <code style={{
                  display: "block",
                  background: "#1a1a1a",
                  color: "#7dd3a8",
                  borderRadius: "4px",
                  padding: "8px 10px",
                  fontSize: "11px",
                  fontFamily: '"Monaco", "Courier New", monospace',
                }}>
                  npm install react-ipod-classic
                </code>
              </div>

              {[
                "Floating widget com posição configurável",
                "Componente embutido &lt;Ipod /&gt;",
                "ClickWheel com rotação 360°",
                "4 temas de iPod incluídos",
                "Suporte a playlists e álbuns",
                "TypeScript 100% tipado",
                "SSR seguro (Next.js, Remix…)",
              ].map((feat) => (
                <div
                  key={feat}
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "flex-start",
                    marginBottom: "8px",
                    fontSize: "12px",
                    color: "#444",
                    lineHeight: 1.5,
                  }}
                  dangerouslySetInnerHTML={{ __html: `<span style="color:#0073e6;font-weight:700;margin-top:1px">✓</span> ${feat}` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Demo section ── */}
      <section
        id="demo"
        style={{
          background: "linear-gradient(to bottom, #f5f5f7 0%, #ebebeb 100%)",
          padding: "40px 20px",
          borderBottom: "1px solid #ccc",
        }}
      >
        <div style={{ maxWidth: "980px", margin: "0 auto" }}>
          <h3 style={{ fontSize: "22px", fontWeight: 300, color: "#1a1a1a", margin: "0 0 6px", textAlign: "center" as const, letterSpacing: "-0.3px" }}>
            Experimenta agora
          </h3>
          <p style={{ fontSize: "13px", color: "#777", textAlign: "center" as const, margin: "0 0 28px" }}>
            Configura o iPod flutuante ou vê o componente embutido na página.
          </p>

          {/* Controls row */}
          <div style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            alignItems: "flex-end",
            flexWrap: "wrap" as const,
            marginBottom: "24px",
          }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#666", marginBottom: "5px", fontWeight: 600 }}>
                Posição do widget flutuante
              </label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as any)}
                style={{
                  padding: "6px 10px",
                  fontSize: "12px",
                  border: "1px solid #bbb",
                  borderRadius: "5px",
                  background: "linear-gradient(to bottom, #fff 0%, #f0f0f0 100%)",
                  color: "#333",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="bottom-right">Inferior Direito</option>
                <option value="bottom-left">Inferior Esquerdo</option>
                <option value="top-right">Superior Direito</option>
                <option value="top-left">Superior Esquerdo</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#666", marginBottom: "5px", fontWeight: 600 }}>
                Tema do iPod
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                style={{
                  padding: "6px 10px",
                  fontSize: "12px",
                  border: "1px solid #bbb",
                  borderRadius: "5px",
                  background: "linear-gradient(to bottom, #fff 0%, #f0f0f0 100%)",
                  color: "#333",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="silver">Silver Classic</option>
                <option value="black">Black Classic</option>
                <option value="u2">Special U2 Edition</option>
                <option value="mnelia">Mnelia Gradient</option>
              </select>
            </div>

            <button
              onClick={() => setShowEmbedded(!showEmbedded)}
              style={{
                padding: "7px 20px",
                fontSize: "12px",
                fontWeight: 700,
                border: "1px solid #0a5a9e",
                borderRadius: "12px",
                background: showEmbedded
                  ? "linear-gradient(to bottom, #76b9e8 0%, #2d7cba 50%, #1e68a8 51%, #3490cf 100%)"
                  : "linear-gradient(to bottom, #fff 0%, #e8e8e8 100%)",
                color: showEmbedded ? "#fff" : "#333",
                cursor: "pointer",
              }}
            >
              {showEmbedded ? "Ocultar modo embutido" : "Ver iPod embutido na página"}
            </button>
          </div>

          {/* Embedded iPod */}
          {showEmbedded && (
            <div style={{
              display: "flex",
              flexDirection: "column" as const,
              alignItems: "center",
              gap: "12px",
              padding: "30px",
              background: "linear-gradient(to bottom, #2a2a2a, #1a1a1a)",
              borderRadius: "12px",
              border: "1px solid #333",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}>
              <span style={{ fontSize: "12px", color: "#aaa", fontWeight: 600, letterSpacing: "0.05em" }}>
                MODO EMBUTIDO — &lt;Ipod /&gt;
              </span>
              <div style={{ width: "370px", height: "620px" }}>
                <Ipod songs={samplePlaylist} theme={theme} showReflection={true} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Code section ── */}
      <section style={{ background: "#fff", padding: "40px 20px", borderBottom: "1px solid #ccc" }}>
        <div style={{ maxWidth: "980px", margin: "0 auto" }}>
          <h3 style={{ fontSize: "20px", fontWeight: 300, color: "#1a1a1a", margin: "0 0 24px", letterSpacing: "-0.3px" }}>
            Como usar no teu site
          </h3>

          <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" as const }}>
            <div style={{ flex: 1, minWidth: "280px" }}>
              <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#0073e6", margin: "0 0 8px" }}>1. Instalar</h4>
              <pre style={{
                background: "#1a1a1a",
                color: "#7dd3a8",
                borderRadius: "6px",
                padding: "12px 16px",
                fontSize: "12px",
                fontFamily: '"Monaco", "Courier New", monospace',
                margin: "0 0 24px",
                overflowX: "auto" as const,
              }}>npm install react-ipod-classic</pre>

              <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#0073e6", margin: "0 0 8px" }}>2. Widget flutuante (mais simples)</h4>
              <pre style={{
                background: "#1a1a1a",
                color: "#c8d8f0",
                borderRadius: "6px",
                padding: "12px 16px",
                fontSize: "11px",
                fontFamily: '"Monaco", "Courier New", monospace',
                margin: "0 0 24px",
                overflowX: "auto" as const,
                lineHeight: 1.6,
              }}>{`import { FloatingIpod } from 'react-ipod-classic';

export default function MySite() {
  return (
    <div>
      {/* O teu site aqui */}

      <FloatingIpod
        songs={[
          {
            name: "Bohemian Rhapsody",
            artistName: "Queen",
            url: "fJ9rUzIMcZQ", // YouTube ID
          }
        ]}
        position="bottom-right"
        theme="silver"
      />
    </div>
  );
}`}</pre>

              <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#0073e6", margin: "0 0 8px" }}>3. Ou via JSON remoto</h4>
              <pre style={{
                background: "#1a1a1a",
                color: "#c8d8f0",
                borderRadius: "6px",
                padding: "12px 16px",
                fontSize: "11px",
                fontFamily: '"Monaco", "Courier New", monospace',
                margin: 0,
                overflowX: "auto" as const,
                lineHeight: 1.6,
              }}>{`<FloatingIpod
  songsUrl="/minha-playlist.json"
  position="bottom-right"
  theme="black"
/>`}</pre>
            </div>

            {/* Props table */}
            <div style={{ flex: 1, minWidth: "280px" }}>
              <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#0073e6", margin: "0 0 10px" }}>Props disponíveis</h4>
              <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: "12px" }}>
                <thead>
                  <tr style={{ background: "linear-gradient(to bottom, #e8eef6, #d8e4f0)" }}>
                    {["Prop", "Tipo", "Descrição"].map((h) => (
                      <th key={h} style={{
                        padding: "7px 10px",
                        textAlign: "left" as const,
                        border: "1px solid #c0cfe0",
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#1a3a6e",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["songs", "IpodSong[]", "Lista de músicas"],
                    ["songsUrl", "string", "URL remoto JSON"],
                    ["position", "string", "bottom-right | bottom-left…"],
                    ["theme", "string", "silver | black | u2 | mnelia"],
                    ["defaultOpen", "boolean", "Começa aberto (padrão: false)"],
                    ["showReflection", "boolean", "Reflexo espelhado"],
                    ["onSongChange", "function", "Callback ao mudar música"],
                    ["onPlayStateChange", "function", "Callback ao play/pause"],
                  ].map(([prop, type, desc], i) => (
                    <tr key={prop} style={{ background: i % 2 === 0 ? "#fff" : "#f8f8f8" }}>
                      <td style={{ padding: "6px 10px", border: "1px solid #ddd", fontFamily: "monospace", color: "#0073e6", fontWeight: 600 }}>{prop}</td>
                      <td style={{ padding: "6px 10px", border: "1px solid #ddd", fontFamily: "monospace", color: "#666", fontSize: "11px" }}>{type}</td>
                      <td style={{ padding: "6px 10px", border: "1px solid #ddd", color: "#444" }}>{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── Dark footer ── */}
      <footer style={{
        background: "linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)",
        borderTop: "1px solid #000",
        padding: "30px 20px",
      }}>
        <div style={{ maxWidth: "980px", margin: "0 auto" }}>
          {/* Footer columns */}
          <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" as const, marginBottom: "24px" }}>
            {[
              {
                title: "iPod.js",
                links: ["Floating Widget", "Componente Embutido", "ClickWheel 360°", "Temas"],
              },
              {
                title: "Developers",
                links: ["Documentação", "GitHub", "npm Package", "TypeScript Types"],
              },
              {
                title: "Projeto",
                links: ["Sobre", "Open Source", "MIT License", "Contribuir"],
              },
              {
                title: "Créditos",
                links: ["gajonormal", "Tanner Villarete", "iPod Classic JS", "React"],
              },
            ].map((col) => (
              <div key={col.title} style={{ flex: 1, minWidth: "150px" }}>
                <h4 style={{ fontSize: "11px", fontWeight: 700, color: "#aaa", margin: "0 0 10px", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
                  {col.title}
                </h4>
                {col.links.map((link) => (
                  <div key={link} style={{ marginBottom: "6px" }}>
                    <span style={{ fontSize: "12px", color: "#76b9e8", cursor: "pointer" }}>{link}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div style={{
            borderTop: "1px solid #333",
            paddingTop: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap" as const,
            gap: "8px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <AppleLogo color="#666" />
              <span style={{ fontSize: "11px", color: "#666" }}>
                Copyright © 2024 iPod.js — Open Source by{" "}
                <a href="https://github.com/gajonormal" target="_blank" rel="noreferrer" style={{ color: "#76b9e8" }}>gajonormal</a>
              </span>
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              {["Site Map", "Hot News", "RSS Feeds", "Contact Us"].map((item) => (
                <span key={item} style={{ fontSize: "11px", color: "#666", cursor: "pointer" }}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ── Floating iPod widget ── */}
      <FloatingIpod
        songs={samplePlaylist}
        position={position}
        theme={theme}
        defaultOpen={false}
      />
    </div>
  );
}
