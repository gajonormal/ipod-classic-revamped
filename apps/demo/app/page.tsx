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
  const [showTopBar, setShowTopBar] = useState(true);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: "radial-gradient(ellipse at center, #173d61 0%, #0d253c 55%, #07131e 100%)",
        color: "#ffffff",
        fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Helvetica, Arial, Verdana, sans-serif',
      }}
    >
      {/* ───────────────────────────────────────────────────────────
          1. APPLE 2007 TOP NAVIGATION BAR (Fixed 34px, authentic chrome)
      ─────────────────────────────────────────────────────────── */}
      {showTopBar && (
        <header
          style={{
            height: "34px",
            minHeight: "34px",
            background: "linear-gradient(180deg, #666666 0%, #3e3e3e 50%, #2b2b2b 51%, #222222 100%)",
            borderBottom: "1px solid #141414",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
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
            {/* Apple  Logo */}
            <div
              style={{
                padding: "0 16px 0 4px",
                height: "100%",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              title="Apple (2007)"
            >
              <svg width="15" height="19" viewBox="0 0 170 170" fill="#f5f5f5">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.94-14.31-6.7-10.22-12-21.73-15.91-34.52-3.9-12.79-5.86-24.81-5.86-36.07 0-14.34 3.49-26.24 10.47-35.7 6.98-9.46 15.75-14.28 26.31-14.47 5.02 0 10.59 1.34 16.71 4.02 6.12 2.68 10.05 4.07 11.79 4.17 1.54 0 5.66-1.46 12.36-4.38 6.7-2.92 12.44-4.23 17.23-3.93 12.87.62 23.32 5.38 31.35 14.28-11.19 6.8-16.68 16.29-16.48 28.47.2 9.5 3.91 17.51 11.13 24.03 7.22 6.52 15.77 10.3 25.65 11.34-2.12 6.38-4.68 12.63-7.69 18.75zM119.22 33.15c0-7.39 2.67-14.43 8.01-21.13 5.34-6.7 11.83-11.16 19.47-13.38.71 7.42-1.78 14.32-7.47 20.7-5.69 6.38-12.35 10.98-19.98 13.81-.02-.33-.03-.66-.03-1z" />
              </svg>
            </div>

            {/* Navigation Links */}
            <nav style={{ display: "flex", height: "100%", flex: 1 }}>
              {[
                { label: "Store", href: "#" },
                { label: "Mac", href: "#" },
                { label: "iPod + iTunes", href: "#", active: true },
                { label: "iPhone", href: "#" },
                { label: "Downloads", href: "#" },
                { label: "Support", href: "#" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0 16px",
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
                    borderLeft: item.active ? "1px solid #1a1a1a" : "none",
                    borderRight: item.active ? "1px solid #1a1a1a" : "none",
                    textDecoration: "none",
                  }}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Theme Picker Pills */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                marginRight: "14px",
                background: "rgba(0, 0, 0, 0.35)",
                padding: "2px 6px",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              {[
                { id: "black", label: "Black" },
                { id: "silver", label: "Silver" },
                { id: "u2", label: "U2" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  style={{
                    background: theme === t.id ? "linear-gradient(180deg, #6cb2f2 0%, #2777bf 100%)" : "transparent",
                    color: theme === t.id ? "#ffffff" : "#aaaaaa",
                    fontSize: "10px",
                    fontWeight: theme === t.id ? "bold" : "normal",
                    border: "none",
                    borderRadius: "10px",
                    padding: "2px 8px",
                    cursor: "pointer",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

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
      )}

      {/* ───────────────────────────────────────────────────────────
          2. THE REAL IPOD CLASSIC ON THE 2007 SPOTLIGHT STAGE
          Takes full remaining viewport, perfectly centered, original size
      ─────────────────────────────────────────────────────────── */}
      <main
        style={{
          flex: 1,
          width: "100%",
          height: showTopBar ? "calc(100vh - 34px)" : "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Toggle Bar Button in bottom-left corner */}
        <button
          onClick={() => setShowTopBar(!showTopBar)}
          title={showTopBar ? "Ocultar barra superior" : "Mostrar barra Apple 2007"}
          style={{
            position: "absolute",
            bottom: "16px",
            left: "16px",
            zIndex: 100,
            background: "rgba(0, 0, 0, 0.45)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "#94a3b8",
            fontSize: "11px",
            padding: "5px 10px",
            borderRadius: "6px",
            cursor: "pointer",
            backdropFilter: "blur(8px)",
            fontFamily: "inherit",
          }}
        >
          {showTopBar ? " Modo Ecrã Completo" : " Mostrar Barra 2007"}
        </button>

        {/* The iPod at its real, full, unconstrained proportions */}
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ipod
            songs={samplePlaylist}
            theme={theme}
            showReflection={false}
            disableAnimation={false}
          />
        </div>
      </main>

      {/* Standalone Floating iPod Widget for site testing */}
      <FloatingIpod
        songs={samplePlaylist}
        theme={theme}
        position="bottom-right"
        defaultOpen={false}
      />
    </div>
  );
}
