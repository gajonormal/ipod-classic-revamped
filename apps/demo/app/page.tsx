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
    name: "Thriller",
    artistName: "Michael Jackson",
    albumName: "Thriller",
    url: "sOnqjkJTMaA",
  },
  {
    name: "Billie Jean",
    artistName: "Michael Jackson",
    albumName: "Thriller",
    url: "Zi_XLOBDo_Y",
  },
];

export default function Page() {
  const [theme, setTheme] = useState<"black" | "silver" | "u2" | "mnelia">("black");
  const [position, setPosition] = useState<
    "bottom-right" | "bottom-left" | "top-right" | "top-left"
  >("bottom-right");
  const [activeTab, setActiveTab] = useState("overview");
  const [useJsonUrl, setUseJsonUrl] = useState(false);
  const [showEmbedded, setShowEmbedded] = useState(true);

  const scrollTo = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      style={{
        background: "#000000",
        color: "#d1d5db",
        minHeight: "100vh",
        fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Helvetica, Arial, Verdana, sans-serif',
        fontSize: "12px",
        overflowX: "hidden",
      }}
    >
      {/* ───────────────────────────────────────────────────────────
          1. TOP NAVIGATION BAR (Apple 2007 Universal Chrome Bar)
      ─────────────────────────────────────────────────────────── */}
      <header
        style={{
          height: "36px",
          background: "linear-gradient(180deg, #666666 0%, #3e3e3e 50%, #2b2b2b 51%, #222222 100%)",
          borderBottom: "1px solid #141414",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          boxShadow: "0 2px 6px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            maxWidth: "960px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            height: "100%",
          }}
        >
          {/* Apple Logo  */}
          <div
            onClick={() => scrollTo("overview")}
            style={{
              padding: "0 18px 0 4px",
              height: "100%",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            title="Apple 2007"
          >
            <svg width="15" height="19" viewBox="0 0 170 170" fill="#f5f5f5">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.94-14.31-6.7-10.22-12-21.73-15.91-34.52-3.9-12.79-5.86-24.81-5.86-36.07 0-14.34 3.49-26.24 10.47-35.7 6.98-9.46 15.75-14.28 26.31-14.47 5.02 0 10.59 1.34 16.71 4.02 6.12 2.68 10.05 4.07 11.79 4.17 1.54 0 5.66-1.46 12.36-4.38 6.7-2.92 12.44-4.23 17.23-3.93 12.87.62 23.32 5.38 31.35 14.28-11.19 6.8-16.68 16.29-16.48 28.47.2 9.5 3.91 17.51 11.13 24.03 7.22 6.52 15.77 10.3 25.65 11.34-2.12 6.38-4.68 12.63-7.69 18.75zM119.22 33.15c0-7.39 2.67-14.43 8.01-21.13 5.34-6.7 11.83-11.16 19.47-13.38.71 7.42-1.78 14.32-7.47 20.7-5.69 6.38-12.35 10.98-19.98 13.81-.02-.33-.03-.66-.03-1z" />
            </svg>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: "flex", height: "100%", flex: 1 }}>
            {[
              { label: "Store", id: "overview" },
              { label: "Mac", id: "config" },
              { label: "iPod + iTunes", id: "overview", active: true },
              { label: "iPhone", id: "json-section" },
              { label: "Downloads", id: "docs-section" },
              { label: "Support", id: "docs-section" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0 18px",
                  fontSize: "12px",
                  fontWeight: item.active ? "bold" : "normal",
                  color: item.active ? "#ffffff" : "#c5c5c5",
                  textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                  background: item.active
                    ? "linear-gradient(180deg, #4d4d4d 0%, #2a2a2a 50%, #1f1f1f 51%, #262626 100%)"
                    : "transparent",
                  boxShadow: item.active
                    ? "inset 1px 0 0 rgba(255,255,255,0.1), inset -1px 0 0 rgba(0,0,0,0.5), inset 0 2px 4px rgba(0,0,0,0.4)"
                    : "none",
                  border: "none",
                  borderLeft: item.active ? "1px solid #1a1a1a" : "none",
                  borderRight: item.active ? "1px solid #1a1a1a" : "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Search Pill */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "linear-gradient(180deg, #222222 0%, #3a3a3a 100%)",
                border: "1px solid #555555",
                borderRadius: "14px",
                padding: "2px 8px",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.7)",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="3" style={{ marginRight: "5px" }}>
                <circle cx="10.5" cy="10.5" r="7.5" />
                <line x1="21" y1="21" x2="15.8" y2="15.8" />
              </svg>
              <input
                type="text"
                placeholder="Search"
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#ffffff",
                  fontSize: "11px",
                  width: "80px",
                  fontFamily: "inherit",
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ───────────────────────────────────────────────────────────
          2. SECONDARY PRODUCT HEADER (iPod Title + Lineup Icons)
      ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "#000000",
          borderBottom: "1px solid #1a1a1a",
          padding: "16px 0 10px",
        }}
      >
        <div
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* iPod Brand */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
            <h1
              style={{
                margin: 0,
                fontSize: "30px",
                fontWeight: 700,
                letterSpacing: "-0.5px",
                color: "#ffffff",
                fontFamily: '"Myriad Set Pro", "Lucida Grande", sans-serif',
              }}
            >
              iPod
            </h1>
            <span style={{ fontSize: "12px", color: "#666666" }}>
              Classic for React
            </span>
          </div>

          {/* 2007 Lineup Icons */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: "28px" }}>
            {[
              {
                name: "iPod shuffle",
                icon: (
                  <div
                    style={{
                      width: "30px",
                      height: "18px",
                      borderRadius: "3px",
                      background: "linear-gradient(180deg, #60a5fa, #2563eb)",
                      border: "1px solid #1d4ed8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.6)",
                    }}
                  >
                    <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#fff", opacity: 0.9 }} />
                  </div>
                ),
              },
              {
                name: "iPod nano",
                icon: (
                  <div style={{ display: "flex", gap: "2px", alignItems: "flex-end" }}>
                    {["#0ea5e9", "#10b981", "#ef4444", "#a855f7"].map((c, i) => (
                      <div
                        key={c}
                        style={{
                          width: "6px",
                          height: `${24 - Math.abs(i - 1.5) * 4}px`,
                          background: c,
                          borderRadius: "2px 2px 0 0",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
                        }}
                      />
                    ))}
                  </div>
                ),
              },
              {
                name: "iPod classic",
                active: true,
                icon: (
                  <div
                    style={{
                      width: "22px",
                      height: "34px",
                      borderRadius: "3px",
                      background: "linear-gradient(180deg, #444444, #1a1a1a)",
                      border: "1px solid #666666",
                      padding: "2px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.8)",
                    }}
                  >
                    <div style={{ width: "18px", height: "13px", background: "#ffffff", borderRadius: "1px", marginBottom: "2px" }} />
                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#222222", border: "1px solid #444444" }} />
                  </div>
                ),
              },
              {
                name: "iTunes",
                icon: (
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "radial-gradient(circle, #38bdf8 0%, #1e40af 100%)",
                      border: "1px solid #60a5fa",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      color: "#fff",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.7)",
                    }}
                  >
                    ♫
                  </div>
                ),
              },
            ].map((p) => (
              <div
                key={p.name}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <div style={{ height: "36px", display: "flex", alignItems: "flex-end", marginBottom: "3px" }}>
                  {p.icon}
                </div>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: p.active ? "bold" : "normal",
                    color: p.active ? "#ffffff" : "#777777",
                  }}
                >
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────
          3. SUB-NAVIGATION BAR (Exact match to Apple 2007 bar)
      ─────────────────────────────────────────────────────────── */}
      <nav
        style={{
          height: "34px",
          background: "linear-gradient(180deg, #383838 0%, #686563 49%, #282625 50%, #202020 100%)",
          borderTop: "1px solid #4a4a4a",
          borderBottom: "1px solid #141414",
          boxShadow: "0 2px 6px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "sticky",
          top: "36px",
          zIndex: 900,
        }}
      >
        <div
          style={{
            maxWidth: "960px",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
          }}
        >
          {/* Apple Logo  on the left */}
          <div
            onClick={() => scrollTo("overview")}
            style={{
              padding: "0 18px 0 6px",
              height: "100%",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            title="Overview"
          >
            <svg width="14" height="18" viewBox="0 0 170 170" fill="#f5f5f5">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.94-14.31-6.7-10.22-12-21.73-15.91-34.52-3.9-12.79-5.86-24.81-5.86-36.07 0-14.34 3.49-26.24 10.47-35.7 6.98-9.46 15.75-14.28 26.31-14.47 5.02 0 10.59 1.34 16.71 4.02 6.12 2.68 10.05 4.07 11.79 4.17 1.54 0 5.66-1.46 12.36-4.38 6.7-2.92 12.44-4.23 17.23-3.93 12.87.62 23.32 5.38 31.35 14.28-11.19 6.8-16.68 16.29-16.48 28.47.2 9.5 3.91 17.51 11.13 24.03 7.22 6.52 15.77 10.3 25.65 11.34-2.12 6.38-4.68 12.63-7.69 18.75zM119.22 33.15c0-7.39 2.67-14.43 8.01-21.13 5.34-6.7 11.83-11.16 19.47-13.38.71 7.42-1.78 14.32-7.47 20.7-5.69 6.38-12.35 10.98-19.98 13.81-.02-.33-.03-.66-.03-1z" />
            </svg>
          </div>

          {/* Navigation Tabs with authentic vertical dividers */}
          <div style={{ display: "flex", height: "100%", flex: 1 }}>
            {[
              { id: "overview", label: "Overview" },
              { id: "config", label: "Configuração" },
              { id: "json-section", label: "Modo JSON" },
              { id: "docs-section", label: "Como Usar (JSX)" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => scrollTo(tab.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 22px",
                    height: "100%",
                    fontSize: "12px",
                    fontWeight: isActive ? 700 : 400,
                    color: isActive ? "#ffffff" : "#c5c5c5",
                    textShadow: "0 1px 2px rgba(0,0,0,0.9)",
                    background: isActive
                      ? "linear-gradient(180deg, #303030 0%, #4a4744 49%, #1e1d1c 50%, #181818 100%)"
                      : "transparent",
                    border: "none",
                    borderLeft: isActive
                      ? "1px solid #141414"
                      : "1px solid rgba(255,255,255,0.08)",
                    borderRight: isActive
                      ? "1px solid #141414"
                      : "1px solid rgba(0,0,0,0.6)",
                    boxShadow: isActive
                      ? "inset 1px 0 0 rgba(255,255,255,0.1), inset -1px 0 0 rgba(0,0,0,0.5), inset 0 2px 4px rgba(0,0,0,0.5)"
                      : "none",
                    cursor: "pointer",
                    outline: "none",
                    fontFamily: "inherit",
                    transition: "color 0.15s ease",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Right side controls: Search Pill + npm install button */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "linear-gradient(180deg, #181818 0%, #303030 100%)",
                border: "1px solid #555555",
                borderRadius: "14px",
                padding: "2px 8px",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.12)",
                height: "20px",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="3" style={{ marginRight: "5px" }}>
                <circle cx="10.5" cy="10.5" r="7.5" />
                <line x1="21" y1="21" x2="15.8" y2="15.8" />
              </svg>
              <input
                type="text"
                placeholder="Search"
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#ffffff",
                  fontSize: "11px",
                  width: "75px",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* Glossy Blue Pill */}
            <button
              onClick={() => scrollTo("docs-section")}
              style={{
                background: "linear-gradient(180deg, #70bdfa 0%, #2f7cbf 50%, #1c5b96 51%, #2b70af 100%)",
                border: "1px solid #164673",
                borderRadius: "14px",
                padding: "3px 14px",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "11px",
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.4)",
                textShadow: "0 -1px 1px rgba(0,0,0,0.6)",
                fontFamily: "inherit",
                height: "22px",
                display: "flex",
                alignItems: "center",
              }}
            >
              npm install
            </button>
          </div>
        </div>
      </nav>

      {/* ───────────────────────────────────────────────────────────
          4. HERO SECTION: THE 2007 SPOTLIGHT STAGE WITH REAL IPOD
      ─────────────────────────────────────────────────────────── */}
      <section
        id="overview"
        style={{
          position: "relative",
          background: "radial-gradient(ellipse at 50% 45%, #173d61 0%, #0d253c 55%, #07131e 100%)",
          padding: "36px 16px 48px",
          textAlign: "center",
          borderBottom: "1px solid #14202d",
        }}
      >
        {/* Stage Headline */}
        <div style={{ maxWidth: "760px", margin: "0 auto 24px" }}>
          <h2
            style={{
              fontSize: "34px",
              fontWeight: 300,
              letterSpacing: "-0.5px",
              color: "#ffffff",
              margin: "0 0 8px",
              textShadow: "0 2px 10px rgba(0,0,0,0.9)",
              lineHeight: 1.2,
            }}
          >
            Movies, TV shows, games, and music.
            <br />
            Now playing on an iPod near you.
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#93b4d4",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            O lendário iPod Classic autêntico agora em componente React interativo.
            Suporta modo flutuante e embutido com playlists locais ou remotas JSON.
          </p>
        </div>

        {/* Finish Selector */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(0, 0, 0, 0.55)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "20px",
            padding: "4px 8px",
            marginBottom: "28px",
          }}
        >
          <span style={{ fontSize: "11px", color: "#8ca8c7", padding: "0 6px" }}>
            Finish:
          </span>
          {[
            { id: "black", label: "Black" },
            { id: "silver", label: "Silver" },
            { id: "u2", label: "U2 Special Edition" },
            { id: "mnelia", label: "Mnelia" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id as any)}
              style={{
                background: theme === t.id ? "linear-gradient(180deg, #5ba4e5 0%, #1c62a8 100%)" : "transparent",
                color: theme === t.id ? "#ffffff" : "#c5c5c5",
                fontWeight: theme === t.id ? "bold" : "normal",
                border: theme === t.id ? "1px solid #6cb5ff" : "1px solid transparent",
                borderRadius: "14px",
                padding: "3px 12px",
                fontSize: "11px",
                cursor: "pointer",
                outline: "none",
                fontFamily: "inherit",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── THE IPOD CLASSIC: FULL NATURAL SIZE, NEVER CUT OFF ── */}
        {showEmbedded && (
          <div
            style={{
              width: "100%",
              maxWidth: "440px",
              height: "640px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              filter: "drop-shadow(0 25px 40px rgba(0, 0, 0, 0.9))",
            }}
          >
            <Ipod
              songs={useJsonUrl ? undefined : samplePlaylist}
              songsUrl={useJsonUrl ? "/demo-songs.json" : undefined}
              theme={theme}
              showReflection={false}
              disableAnimation={false}
            />
          </div>
        )}

        <div style={{ marginTop: "16px" }}>
          <button
            onClick={() => setShowEmbedded(!showEmbedded)}
            style={{
              background: "rgba(0, 0, 0, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#94a3b8",
              fontSize: "11px",
              padding: "4px 12px",
              borderRadius: "12px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {showEmbedded ? "Ocultar Modo Embutido" : "Exibir iPod Embutido"}
          </button>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────
          5. CONTROLS CARD (Styled in 2007 Apple Brushed Aluminum)
      ─────────────────────────────────────────────────────────── */}
      <section
        id="config"
        style={{
          background: "#0a0d14",
          borderBottom: "1px solid #1a2230",
          padding: "48px 16px",
        }}
      >
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <div
            style={{
              background: "linear-gradient(180deg, #242933 0%, #161a22 100%)",
              border: "1px solid #374151",
              borderRadius: "16px",
              padding: "28px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#10b981",
                  boxShadow: "0 0 8px #10b981",
                }}
              />
              <h3 style={{ margin: 0, fontSize: "18px", color: "#ffffff", fontWeight: 600 }}>
                🎛️ Painel de Configuração do iPod
              </h3>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "20px",
              }}
            >
              {/* Position selector */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "#94a3b8",
                    marginBottom: "8px",
                    fontWeight: 600,
                  }}
                >
                  Posição do Floating iPod:
                </label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value as any)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background: "#0b0f17",
                    color: "#ffffff",
                    border: "1px solid #4b5563",
                    fontSize: "13px",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="bottom-right">Inferior Direito (bottom-right)</option>
                  <option value="bottom-left">Inferior Esquerdo (bottom-left)</option>
                  <option value="top-right">Superior Direito (top-right)</option>
                  <option value="top-left">Superior Esquerdo (top-left)</option>
                </select>
              </div>

              {/* Theme selector */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "#94a3b8",
                    marginBottom: "8px",
                    fontWeight: 600,
                  }}
                >
                  Tema do Chassis:
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as any)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background: "#0b0f17",
                    color: "#ffffff",
                    border: "1px solid #4b5563",
                    fontSize: "13px",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="black">Black Classic</option>
                  <option value="silver">Silver Classic</option>
                  <option value="u2">Special U2 Edition (Red Wheel)</option>
                  <option value="mnelia">Mnelia Gradient</option>
                </select>
              </div>

              {/* Playlist source selector */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "#94a3b8",
                    marginBottom: "8px",
                    fontWeight: 600,
                  }}
                >
                  Fonte da Playlist:
                </label>
                <button
                  onClick={() => setUseJsonUrl(!useJsonUrl)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background: useJsonUrl
                      ? "linear-gradient(180deg, #059669 0%, #047857 100%)"
                      : "linear-gradient(180deg, #374151 0%, #1f2937 100%)",
                    color: "#ffffff",
                    border: useJsonUrl ? "1px solid #34d399" : "1px solid #4b5563",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  {useJsonUrl ? "✓ Modo JSON Ativo (/demo-songs.json)" : "Usar Lista Local (Props)"}
                </button>
              </div>
            </div>

            <div
              style={{
                marginTop: "20px",
                padding: "12px 16px",
                background: "rgba(0,0,0,0.3)",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                💡 O <strong>FloatingIpod</strong> está ativo no canto da janela (<strong>{position}</strong>).
                Clica no botão circular no canto para abri-lo e controlá-lo!
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────
          6. JSON PLAYLIST SECTION (Remote Loading & Schema)
      ─────────────────────────────────────────────────────────── */}
      <section
        id="json-section"
        style={{
          background: "#080a0f",
          borderBottom: "1px solid #1a2230",
          padding: "48px 16px",
        }}
      >
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <div style={{ marginBottom: "20px" }}>
            <span
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "#38bdf8",
                fontWeight: 700,
              }}
            >
              Recurso Avançado
            </span>
            <h2 style={{ fontSize: "24px", color: "#ffffff", margin: "6px 0 10px" }}>
              Carregamento Dinâmico de Músicas via JSON (`songsUrl`)
            </h2>
            <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>
              Podes fornecer um endpoint HTTP ou ficheiro estático `.json` diretamente através da propriedade <code>songsUrl</code>.
              O iPod faz o fetch automático e constrói a biblioteca com álbuns, artistas e Cover Flow!
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {/* Example Usage */}
            <div
              style={{
                background: "#04060a",
                border: "1px solid #1f2937",
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <h4 style={{ margin: "0 0 12px", color: "#f3f4f6", fontSize: "13px" }}>
                Como passar o URL no React:
              </h4>
              <pre
                style={{
                  margin: 0,
                  padding: "14px",
                  background: "#000000",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#38bdf8",
                  overflowX: "auto",
                  border: "1px solid #111827",
                  lineHeight: 1.5,
                }}
              >
{`<FloatingIpod
  songsUrl="/demo-songs.json"
  theme="${theme}"
  position="${position}"
/>`}
              </pre>
            </div>

            {/* JSON Schema Preview */}
            <div
              style={{
                background: "#04060a",
                border: "1px solid #1f2937",
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h4 style={{ margin: 0, color: "#f3f4f6", fontSize: "13px" }}>
                  Estrutura de <code>/demo-songs.json</code>:
                </h4>
                <a
                  href="/demo-songs.json"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "#38bdf8",
                    fontSize: "11px",
                    textDecoration: "underline",
                  }}
                >
                  Abrir JSON ↗
                </a>
              </div>
              <pre
                style={{
                  margin: 0,
                  padding: "14px",
                  background: "#000000",
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: "#a7f3d0",
                  maxHeight: "180px",
                  overflowY: "auto",
                  border: "1px solid #111827",
                  lineHeight: 1.4,
                }}
              >
{`[
  {
    "id": "dQw4w9WgXcQ",
    "name": "Never Gonna Give You Up",
    "artistName": "Rick Astley",
    "albumName": "Whenever You Need Somebody",
    "url": "dQw4w9WgXcQ",
    "artwork": {
      "url": "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
    }
  },
  {
    "id": "fJ9rUzIMcZQ",
    "name": "Bohemian Rhapsody",
    "artistName": "Queen",
    "albumName": "A Night at the Opera",
    "url": "fJ9rUzIMcZQ"
  }
]`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────
          7. HOW TO USE IN REACT (JSX DOCS)
      ─────────────────────────────────────────────────────────── */}
      <section
        id="docs-section"
        style={{
          background: "#06070a",
          borderBottom: "1px solid #151a24",
          padding: "48px 16px",
        }}
      >
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <div>
              <h2 style={{ fontSize: "24px", color: "#ffffff", margin: "0 0 6px" }}>
                Como instalar e utilizar no teu projeto React
              </h2>
              <p style={{ fontSize: "14px", color: "#9ca3af", margin: 0 }}>
                Compatível com Next.js (App Router e Pages Router), Vite, Remix e Create React App.
              </p>
            </div>
            <div
              style={{
                background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
                border: "1px solid #334155",
                padding: "8px 16px",
                borderRadius: "8px",
                color: "#10b981",
                fontWeight: 600,
                fontSize: "13px",
              }}
            >
              npm install react-ipod-classic
            </div>
          </div>

          <pre
            style={{
              margin: 0,
              padding: "20px",
              background: "#020408",
              borderRadius: "12px",
              fontSize: "13px",
              color: "#e2e8f0",
              overflowX: "auto",
              border: "1px solid #1e293b",
              lineHeight: 1.6,
            }}
          >
{`import { FloatingIpod, Ipod } from 'react-ipod-classic';

export default function App() {
  const playlist = [
    {
      name: "Thriller",
      artistName: "Michael Jackson",
      albumName: "Thriller",
      url: "sOnqjkJTMaA", // YouTube Video ID
    },
    {
      name: "Feel Good Inc.",
      artistName: "Gorillaz",
      albumName: "Demon Days",
      url: "HyHNuVaZJ-k",
    }
  ];

  return (
    <div>
      {/* O conteúdo do teu site */}

      {/* Opção 1: iPod Flutuante no canto */}
      <FloatingIpod
        songs={playlist}
        position="${position}"
        theme="${theme}"
        defaultOpen={false}
      />

      {/* Opção 2: Ou iPod Embutido na página */}
      {/* <Ipod songs={playlist} theme="${theme}" /> */}
    </div>
  );
}`}
          </pre>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────
          8. AUTHENTIC APPLE 2007 MULTI-COLUMN FOOTER
      ─────────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: "#000000",
          borderTop: "1px solid #141414",
          padding: "36px 16px 28px",
          color: "#666666",
          fontSize: "11px",
        }}
      >
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "24px",
              marginBottom: "28px",
            }}
          >
            <div>
              <h5 style={{ color: "#ffffff", margin: "0 0 10px", fontSize: "11px" }}>iPod + iTunes</h5>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 2 }}>
                <li><a href="#overview">iPod Classic</a></li>
                <li><a href="#overview">iPod nano</a></li>
                <li><a href="#overview">iPod shuffle</a></li>
                <li><a href="#overview">iTunes Store</a></li>
              </ul>
            </div>
            <div>
              <h5 style={{ color: "#ffffff", margin: "0 0 10px", fontSize: "11px" }}>Recursos</h5>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 2 }}>
                <li><a href="#config">Painel de Configuração</a></li>
                <li><a href="#json-section">Carregar via JSON</a></li>
                <li><a href="#docs-section">Instalação npm</a></li>
                <li><a href="#docs-section">Documentação JSX</a></li>
              </ul>
            </div>
            <div>
              <h5 style={{ color: "#ffffff", margin: "0 0 10px", fontSize: "11px" }}>Compatibilidade</h5>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 2 }}>
                <li>Next.js App Router</li>
                <li>Next.js Pages Router</li>
                <li>Vite / React 18+ / React 19</li>
                <li>Remix / CRA</li>
              </ul>
            </div>
            <div>
              <h5 style={{ color: "#ffffff", margin: "0 0 10px", fontSize: "11px" }}>Apple Store (2007)</h5>
              <p style={{ margin: 0, lineHeight: 1.6 }}>
                Shop the Apple Online Store (1-800-MY-APPLE), visit an Apple Store, or find a reseller.
              </p>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid #181818",
              paddingTop: "16px",
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <span>
              Copyright © 2007 Apple Inc. / react-ipod-classic. Todos os direitos reservados.
            </span>
            <div style={{ display: "flex", gap: "16px" }}>
              <a href="#">Termos de Uso</a>
              <a href="#">Política de Privacidade</a>
              <a href="#">Mapa do Site</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ───────────────────────────────────────────────────────────
          9. THE LIVE FLOATING IPOD COMPONENT
      ─────────────────────────────────────────────────────────── */}
      <FloatingIpod
        songs={useJsonUrl ? undefined : samplePlaylist}
        songsUrl={useJsonUrl ? "/demo-songs.json" : undefined}
        theme={theme}
        position={position}
        defaultOpen={false}
      />
    </div>
  );
}
