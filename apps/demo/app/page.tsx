"use client";
import React, { useState } from "react";
import type { IpodSong } from "react-ipod-classic";
import { FloatingIpod, Ipod } from "./components/ClientIpod";

const samplePlaylist: IpodSong[] = [
  {
    name: "Dani California",
    artistName: "Red Hot Chili Peppers",
    albumName: "Stadium Arcadium",
    url: "Sb5aq5HAI1A",
  },
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
];

export default function Page() {
  const [theme, setTheme] = useState<"black" | "silver" | "u2" | "mnelia">("black");
  const [position, setPosition] = useState<
    "bottom-right" | "bottom-left" | "top-right" | "top-left"
  >("bottom-right");
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div
      style={{
        background: "#000000",
        color: "#ffffff",
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
        }}
      >
        <div
          style={{
            maxWidth: "940px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            height: "100%",
          }}
        >
          {/* Apple Logo */}
          <div
            style={{
              padding: "0 18px 0 6px",
              height: "100%",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <svg width="17" height="21" viewBox="0 0 170 170" fill="#f5f5f5">
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
                  padding: "0 18px",
                  fontSize: "12px",
                  fontWeight: item.active ? "bold" : "normal",
                  color: item.active ? "#ffffff" : "#cccccc",
                  textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                  background: item.active
                    ? "linear-gradient(180deg, #4d4d4d 0%, #2a2a2a 50%, #1f1f1f 51%, #262626 100%)"
                    : "transparent",
                  boxShadow: item.active
                    ? "inset 1px 0 0 rgba(255,255,255,0.1), inset -1px 0 0 rgba(0,0,0,0.5), inset 0 2px 4px rgba(0,0,0,0.4)"
                    : "none",
                  borderLeft: item.active ? "1px solid #1a1a1a" : "none",
                  borderRight: item.active ? "1px solid #1a1a1a" : "none",
                  transition: "color 0.15s ease",
                }}
              >
                {item.label}
              </a>
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
                padding: "2px 10px",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.7)",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="3" style={{ marginRight: "6px" }}>
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
                  width: "110px",
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
            maxWidth: "940px",
            margin: "0 auto",
            padding: "0 16px",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          {/* Main "iPod" Wordmark */}
          <h1
            style={{
              fontSize: "40px",
              fontWeight: 800,
              letterSpacing: "-1px",
              margin: 0,
              lineHeight: 1,
              color: "#ffffff",
              textShadow: "0 2px 4px rgba(0,0,0,0.9)",
            }}
          >
            iPod
          </h1>

          {/* 2007 Product Lineup Icons */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: "28px" }}>
            {[
              {
                name: "iPod shuffle",
                icon: (
                  <div
                    style={{
                      width: "36px",
                      height: "22px",
                      borderRadius: "3px",
                      background: "linear-gradient(180deg, #ff8c3b, #d95a00)",
                      border: "1px solid #ffaa66",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.6)",
                    }}
                  >
                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#fff", opacity: 0.9 }} />
                  </div>
                ),
              },
              {
                name: "iPod nano",
                icon: (
                  <div style={{ display: "flex", gap: "2px", alignItems: "flex-end" }}>
                    {["#0ea5e9", "#10b981", "#ef4444", "#a855f7", "#3b82f6"].map((c, i) => (
                      <div
                        key={c}
                        style={{
                          width: "7px",
                          height: `${28 - Math.abs(i - 2) * 4}px`,
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
                name: "iPod",
                active: true,
                icon: (
                  <div
                    style={{
                      width: "24px",
                      height: "38px",
                      borderRadius: "4px",
                      background: "linear-gradient(180deg, #ffffff, #dddddd)",
                      border: "1px solid #aaaaaa",
                      padding: "2px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.8)",
                    }}
                  >
                    <div style={{ width: "20px", height: "16px", background: "#0ea5e9", borderRadius: "2px", marginBottom: "3px" }} />
                    <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "#eeeeee", border: "1px solid #cccccc" }} />
                  </div>
                ),
              },
              {
                name: "Apple TV",
                icon: (
                  <div
                    style={{
                      width: "38px",
                      height: "14px",
                      borderRadius: "2px",
                      background: "linear-gradient(180deg, #e5e5e5, #999999)",
                      border: "1px solid #777",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.6)",
                    }}
                  />
                ),
              },
              {
                name: "iTunes",
                icon: (
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: "radial-gradient(circle, #38bdf8 0%, #1e40af 100%)",
                      border: "1px solid #60a5fa",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.7)",
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
                <div style={{ height: "40px", display: "flex", alignItems: "flex-end", marginBottom: "4px" }}>
                  {p.icon}
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: p.active ? "bold" : "normal",
                    color: p.active ? "#ffffff" : "#888888",
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
          3. SUB-NAVIGATION TABS (Overview, Features... + Buy Now Pill)
      ─────────────────────────────────────────────────────────── */}
      <nav
        style={{
          background: "linear-gradient(180deg, #444444 0%, #2f2f2f 50%, #222222 51%, #2c2c2c 100%)",
          borderTop: "1px solid #5a5a5a",
          borderBottom: "1px solid #0a0a0a",
          height: "36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: "940px",
            width: "100%",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Tabs */}
          <div style={{ display: "flex", gap: "24px" }}>
            {["Overview", "Features", "Sync with iTunes", "Accessories", "Car Integration", "Tech Specs"].map(
              (tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      background: "none",
                      border: "none",
                      color: isActive ? "#ffffff" : "#aaaaaa",
                      fontWeight: isActive ? "bold" : "normal",
                      fontSize: "12px",
                      cursor: "pointer",
                      padding: "4px 0",
                      position: "relative",
                      outline: "none",
                      fontFamily: "inherit",
                    }}
                  >
                    {tab}
                    {isActive && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "-6px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "100%",
                          height: "2px",
                          background: "#38bdf8",
                          boxShadow: "0 0 6px #38bdf8",
                        }}
                      />
                    )}
                  </button>
                );
              }
            )}
          </div>

          {/* Buy Now Button (2007 Apple glossy pill) */}
          <button
            onClick={() => {
              const el = document.getElementById("embed-section");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              background: "linear-gradient(180deg, #70bdfa 0%, #2f7cbf 50%, #1c5b96 51%, #2b70af 100%)",
              border: "1px solid #164673",
              borderRadius: "14px",
              padding: "4px 18px",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "11px",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.4)",
              textShadow: "0 -1px 1px rgba(0,0,0,0.6)",
              fontFamily: "inherit",
            }}
          >
            Buy Now
          </button>
        </div>
      </nav>

      {/* ───────────────────────────────────────────────────────────
          4. HERO SECTION: The 2007 Spotlight Stage with REAL IPOD
      ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          background: "radial-gradient(ellipse 75% 65% at 50% 48%, #14355a 0%, #0a1b30 45%, #040912 75%, #000000 100%)",
          padding: "54px 16px 20px",
          textAlign: "center",
          borderBottom: "1px solid #111111",
          overflow: "hidden",
        }}
      >
        {/* Subtle stage spotlight lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 50% 30%, rgba(56, 189, 248, 0.12) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />

        {/* 2007 Iconic Headline */}
        <div style={{ maxWidth: "800px", margin: "0 auto 36px", position: "relative", zIndex: 1 }}>
          <h2
            style={{
              fontSize: "36px",
              fontWeight: 300,
              letterSpacing: "-0.5px",
              color: "#ffffff",
              margin: "0 0 6px",
              textShadow: "0 2px 12px rgba(0,0,0,0.9)",
              lineHeight: 1.2,
            }}
          >
            Movies, TV shows, games, and music.
          </h2>
          <h3
            style={{
              fontSize: "36px",
              fontWeight: 800,
              letterSpacing: "-0.5px",
              color: "#ffffff",
              margin: 0,
              textShadow: "0 2px 14px rgba(0,0,0,0.9)",
              lineHeight: 1.2,
            }}
          >
            Now playing on an <span style={{ color: "#ffffff" }}>iPod</span> near you.
          </h3>
        </div>

        {/* Theme Picker Pills */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(0, 0, 0, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "20px",
            padding: "4px 8px",
            marginBottom: "32px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <span style={{ fontSize: "11px", color: "#888888", padding: "0 8px" }}>Finish:</span>
          {[
            { id: "black", label: "Black" },
            { id: "silver", label: "Silver" },
            { id: "u2", label: "Special U2 Edition" },
            { id: "mnelia", label: "Mnelia" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id as any)}
              style={{
                background: theme === t.id ? "rgba(255, 255, 255, 0.2)" : "transparent",
                color: theme === t.id ? "#ffffff" : "#aaaaaa",
                fontWeight: theme === t.id ? "bold" : "normal",
                border: theme === t.id ? "1px solid rgba(255, 255, 255, 0.3)" : "1px solid transparent",
                borderRadius: "14px",
                padding: "3px 12px",
                fontSize: "11px",
                cursor: "pointer",
                outline: "none",
                fontFamily: "inherit",
                transition: "all 0.15s ease",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── THE REAL FUNCTIONAL IPOD AT FULL NATURAL SIZE ── */}
        <div
          style={{
            maxWidth: "430px",
            height: "760px",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
            filter: "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.95))",
          }}
        >
          <Ipod
            songs={samplePlaylist}
            theme={theme}
            showReflection={true}
            disableAnimation={false}
          />
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────
          5. 2007 EDITORIAL DETAILS SECTION (Authentic 2-Column Grid)
      ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "#000000",
          padding: "48px 16px 36px",
          borderBottom: "1px solid #1a1a1a",
        }}
      >
        <div style={{ maxWidth: "940px", margin: "0 auto" }}>
          {/* Main Lead Paragraph */}
          <p
            style={{
              fontSize: "13px",
              lineHeight: 1.6,
              color: "#ffffff",
              fontWeight: 600,
              margin: "0 0 36px",
            }}
          >
            Now that you can buy movies from the iTunes Store and sync them to your iPod, the whole world is your theater. With a 30GB or 80GB iPod in hand, those movies fit comfortably next to TV shows, new iPod games, podcasts, audiobooks, photo albums, and, of course, an entire library of music — up to 20,000 songs, in fact. Now starting at $249, iPod is a pocket-size prodigy.
          </p>

          {/* Two-Column Authentic Layout */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "48px",
            }}
          >
            {/* Left Column */}
            <div>
              {/* 80GB Metallic Badge + Watch this space */}
              <div style={{ display: "flex", gap: "16px", marginBottom: "32px", alignItems: "flex-start" }}>
                {/* Authentic 80GB Embossed Metallic Badge */}
                <div
                  style={{
                    width: "82px",
                    height: "46px",
                    flexShrink: 0,
                    borderRadius: "8px",
                    background: "linear-gradient(180deg, #7a7a7a 0%, #4a4a4a 50%, #303030 51%, #3d3d3d 100%)",
                    border: "1px solid #8e8e8e",
                    boxShadow: "inset 0 1px 2px rgba(255,255,255,0.4), 0 2px 5px rgba(0,0,0,0.8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontSize: "16px",
                    fontWeight: 800,
                    letterSpacing: "-0.5px",
                    textShadow: "0 -1px 1px rgba(0,0,0,0.8)",
                  }}
                >
                  80GB
                </div>
                <div>
                  <h4 style={{ fontSize: "13px", fontWeight: "bold", color: "#ffffff", margin: "0 0 6px" }}>
                    Watch this space
                  </h4>
                  <p style={{ fontSize: "11px", lineHeight: 1.55, color: "#9ca3af", margin: 0 }}>
                    How much can your pocket hold? That's up to you and your iPod. It holds up to 20,000 songs, up to 25,000 photos, and up to 100 hours of video — or any combination of each. So you can browse movies on the iTunes Store, download the ones you want (<em>Pirates of the Caribbean: The Curse of the Black Pearl</em>, perhaps?), then sync it to your iPod. Same goes for TV episodes, new <strong>iPod games</strong>, 99¢ songs, best-selling audiobooks, and an entire universe of free podcasts, including captivating <strong>tours</strong> to 2008 museums, and French chateaux. Go ahead. Fill 'er up.
                  </p>
                </div>
              </div>

              {/* Suit Yourself */}
              <div style={{ marginTop: "24px" }}>
                <h4 style={{ fontSize: "13px", fontWeight: "bold", color: "#ffffff", margin: "0 0 6px" }}>
                  Suit yourself
                </h4>
                <p style={{ fontSize: "11px", lineHeight: 1.55, color: "#9ca3af", margin: "0 0 16px" }}>
                  From cases to <strong>car</strong> kits, customize your iPod with <strong>accessories</strong> made especially for it. Pick up an iPod Universal Dock for more convenient syncing. Add an iPod Hi-Fi for room-filling sound. Sync photos on the go with an iPod Camera Connector. Attach a voice recorder to take audio notes. And if you buy from the Apple Store online, you can even have your iPod engraved with your name or a message.
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Play all day */}
              <div style={{ marginBottom: "28px" }}>
                <h4 style={{ fontSize: "13px", fontWeight: "bold", color: "#ffffff", margin: "0 0 6px" }}>
                  Play all day
                </h4>
                <p style={{ fontSize: "11px", lineHeight: 1.55, color: "#9ca3af", margin: 0 }}>
                  With all that music at your fingertips, you may never want to stop listening. Lucky thing your iPod plays audio for up to 20 hours.² Or if you'd rather watch, you can feast your eyes on movies and TV shows for up to six-and-a-half hours.³
                </p>
              </div>

              {/* Pack light */}
              <div style={{ marginBottom: "28px" }}>
                <h4 style={{ fontSize: "13px", fontWeight: "bold", color: "#ffffff", margin: "0 0 6px" }}>
                  Pack light
                </h4>
                <p style={{ fontSize: "11px", lineHeight: 1.55, color: "#9ca3af", margin: 0 }}>
                  It might be a miracle. Otherwise, it's hard to explain exactly how 30GB or 80GB can fit into an iPod that's over 30% thinner than the previous fourth generation. Or how an 80GB iPod can be the same size as the 60GB model before it. However it happened, it means you can carry your entire music collection — plus a nice selection of video — absolutely everywhere you go. And a 60% brighter, more vibrant display gives your album art, photos, and video extra oomph.
                </p>
              </div>

              {/* Search and enjoy */}
              <div>
                <h4 style={{ fontSize: "13px", fontWeight: "bold", color: "#ffffff", margin: "0 0 6px" }}>
                  Search and enjoy
                </h4>
                <p style={{ fontSize: "11px", lineHeight: 1.55, color: "#9ca3af", margin: 0 }}>
                  Finding what you want to hear among 20,000 songs could be quite a chore — unless you have an iPod. A new <strong>interface</strong> lets you search your iPod using the patented Click Wheel. And if you're a fan of live albums, classical works, or anything that sounds best when it's continuous, iPod supports gapless playback that seamlessly transitions from one song to another.
                </p>
              </div>
            </div>
          </div>

          {/* Footnotes */}
          <div
            style={{
              marginTop: "44px",
              paddingTop: "16px",
              borderTop: "1px solid #1a1a1a",
              fontSize: "10px",
              lineHeight: 1.5,
              color: "#666666",
            }}
          >
            <p style={{ margin: "0 0 4px" }}>
              1. Song capacity based on 4 minutes per song and 128-Kbps AAC encoding; actual capacity varies by content. Photo capacity based on iPod-viewable photos transferred from iTunes. Video capacity based on H.264 1.5-Mbps video at 640-by-480 resolution combined with 128-Kbps audio; actual capacity varies by content.
            </p>
            <p style={{ margin: "0 0 4px" }}>
              2. Up to 20 hours of battery life refers to 80GB model and music playback.
            </p>
            <p style={{ margin: "0 0 4px" }}>
              3. 6.5 hours of battery life refers to 80GB model and is based on H.264 1.5-Mbps video at 640-by-480 resolution combined with 128-Kbps audio. Rechargeable batteries have a limited number of charge cycles and may eventually need to be replaced. Battery life and number of charge cycles vary by use and settings. See <u>www.apple.com/batteries</u> for more information.
            </p>
            <p style={{ margin: "0 0 8px" }}>4. 1GB = 1 billion bytes; actual formatted capacity less.</p>
            <p style={{ margin: 0, fontStyle: "italic" }}>Cars available on iTunes in selected countries. © Disney/Pixar</p>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────
          6. THREE PROMO CARDS (College Students, iTunes 7, Buy Now)
      ─────────────────────────────────────────────────────────── */}
      <section
        id="embed-section"
        style={{
          background: "#000000",
          padding: "36px 16px",
          borderBottom: "1px solid #1a1a1a",
        }}
      >
        <div
          style={{
            maxWidth: "940px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1.3fr 1fr",
            border: "1px solid #222222",
            background: "#080808",
          }}
        >
          {/* Card 1: College Students */}
          <div
            style={{
              padding: "24px 20px",
              borderRight: "1px solid #222222",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "bold", color: "#ffffff", margin: "0 0 16px" }}>
                College Students,
              </h4>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "16px 0" }}>
                {/* MacBook + nano outline */}
                <div style={{ width: "48px", height: "32px", border: "2px solid #ffffff", borderRadius: "3px" }} />
                <span style={{ fontSize: "20px", fontWeight: "bold" }}>+</span>
                <div style={{ width: "16px", height: "32px", background: "#10b981", borderRadius: "3px" }} />
              </div>
              <p style={{ fontSize: "13px", fontWeight: "bold", color: "#ffffff", margin: "0 0 8px" }}>
                buy a Mac and get a free iPod nano.*
              </p>
            </div>
            <p style={{ fontSize: "10px", color: "#eab308", margin: 0, fontWeight: "bold" }}>
              Hurry — offer ends 9/16.
            </p>
          </div>

          {/* Card 2: iTunes 7 / Web Component Integration */}
          <div
            style={{
              padding: "24px 20px",
              borderRight: "1px solid #222222",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h4 style={{ fontSize: "15px", fontWeight: "bold", color: "#ffffff", margin: "0 0 8px" }}>
                react-ipod-classic
              </h4>
              <p style={{ fontSize: "11px", color: "#9ca3af", margin: "0 0 14px", lineHeight: 1.5 }}>
                Adiciona este iPod Classic interativo a qualquer site React com o novo componente flutuante ou embutido.
              </p>
              <div
                style={{
                  background: "#121212",
                  border: "1px solid #333333",
                  borderRadius: "6px",
                  padding: "8px 12px",
                  fontFamily: "monospace",
                  fontSize: "11px",
                  color: "#38bdf8",
                  marginBottom: "16px",
                }}
              >
                npm install react-ipod-classic
              </div>
            </div>
            <a
              href="https://github.com/gajonormal/ipod-classic-revamped"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                alignSelf: "flex-start",
                background: "linear-gradient(180deg, #70bdfa 0%, #2f7cbf 50%, #1c5b96 51%, #2b70af 100%)",
                border: "1px solid #164673",
                borderRadius: "14px",
                padding: "5px 16px",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "11px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.6)",
              }}
            >
              Free Download ➔
            </a>
          </div>

          {/* Card 3: Buy Now / Options */}
          <div
            style={{
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <button
                  style={{
                    background: "linear-gradient(180deg, #70bdfa 0%, #2f7cbf 50%, #1c5b96 51%, #2b70af 100%)",
                    border: "1px solid #164673",
                    borderRadius: "12px",
                    padding: "3px 14px",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "11px",
                    cursor: "pointer",
                  }}
                >
                  Buy Now
                </button>
                <span style={{ fontSize: "10px", color: "#888888" }}>1-800-MY-APPLE</span>
              </div>
              <p style={{ fontSize: "10px", color: "#aaaaaa", margin: "0 0 10px" }}>
                Free laser engraving on all models.
              </p>

              {/* Corner position switcher for Floating iPod */}
              <div style={{ marginTop: "10px" }}>
                <span style={{ fontSize: "10px", color: "#888888", display: "block", marginBottom: "4px" }}>
                  Floating iPod Position:
                </span>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value as any)}
                  style={{
                    width: "100%",
                    background: "#181818",
                    color: "#ffffff",
                    border: "1px solid #333333",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    fontSize: "11px",
                    outline: "none",
                  }}
                >
                  <option value="bottom-right">Bottom Right (Padrão)</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="top-left">Top Left</option>
                </select>
              </div>
            </div>
            <div style={{ borderTop: "1px solid #222", paddingTop: "8px", marginTop: "12px" }}>
              <span style={{ fontSize: "10px", color: "#666666" }}>
                Click no botão flutuante ♫ no canto para abrir o iPod a qualquer momento!
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────
          7. AUTHENTIC 2007 APPLE FOOTER
      ─────────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: "#000000",
          padding: "32px 16px 48px",
          color: "#888888",
          fontSize: "11px",
        }}
      >
        <div style={{ maxWidth: "940px", margin: "0 auto" }}>
          {/* Breadcrumbs */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <span style={{ color: "#aaaaaa", cursor: "pointer" }}></span>
            <span>&gt;</span>
            <span style={{ color: "#aaaaaa", cursor: "pointer" }}>iPod + iTunes</span>
            <span>&gt;</span>
            <span style={{ color: "#ffffff", fontWeight: "bold" }}>iPod</span>
          </div>

          {/* Directory Columns */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "16px",
              paddingBottom: "24px",
              borderBottom: "1px solid #1a1a1a",
              marginBottom: "16px",
            }}
          >
            {[
              {
                title: "iPod and Apple TV",
                links: ["iPod", "iPod nano", "iPod shuffle", "Apple TV"],
              },
              {
                title: "iTunes",
                links: ["Download iTunes 7", "iTunes Store", "iTunes Jukebox", "Sync with iPod"],
              },
              {
                title: "iTunes Store",
                links: ["Buy Music Now", "New Releases", "Free Single of the Week", "Complete My Album"],
              },
              {
                title: "More iPod + iTunes",
                links: ["iPod Accessories", "Nike + iPod", "TV Ads", "iPod in Education"],
              },
              {
                title: "Gifting",
                links: ["Buy iTunes Gift Cards", "Redeem Gift Cards", "iPod Corporate Gifting", "Engraving & Gift Wrap"],
              },
              {
                title: "Working with iTunes",
                links: ["Music Requests", "Labels and Artists", "Affiliates", "iTunes U"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h5 style={{ color: "#cccccc", fontSize: "11px", fontWeight: "bold", margin: "0 0 8px" }}>
                  {col.title}
                </h5>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {col.links.map((link) => (
                    <li key={link} style={{ marginBottom: "5px" }}>
                      <a href="#" style={{ color: "#777777", textDecoration: "none" }}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Copyright & Links */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <p style={{ margin: 0, color: "#666666" }}>
              Shop the Apple Store online (1-800-MY-APPLE), visit an Apple Store location, or find a reseller.
            </p>
            <div style={{ display: "flex", gap: "12px", color: "#666666" }}>
              <a href="#">Site Map</a>
              <span>|</span>
              <a href="#">Hot News</a>
              <span>|</span>
              <a href="#">RSS Feeds</a>
              <span>|</span>
              <a href="#">Contact Us</a>
            </div>
          </div>
          <div style={{ marginTop: "8px", color: "#555555" }}>
            Copyright © 2007 Apple Inc. All rights reserved. <a href="#" style={{ color: "#777" }}>Terms of Use</a> | <a href="#" style={{ color: "#777" }}>Privacy Policy</a>
          </div>
        </div>
      </footer>

      {/* ───────────────────────────────────────────────────────────
          8. THE FLOATING IPOD WIDGET (Always ready in the corner)
      ─────────────────────────────────────────────────────────── */}
      <FloatingIpod
        songs={samplePlaylist}
        position={position}
        theme={theme}
        defaultOpen={false}
      />
    </div>
  );
}
