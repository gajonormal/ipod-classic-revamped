"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import type { IpodSong } from "react-ipod-classic";

const FloatingIpod = dynamic(
  () => import("react-ipod-classic").then((mod) => mod.FloatingIpod),
  { ssr: false }
);

const Ipod = dynamic(
  () => import("react-ipod-classic").then((mod) => mod.Ipod),
  { ssr: false }
);

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
];

export default function Page() {
  const [position, setPosition] = useState<
    "bottom-right" | "bottom-left" | "top-right" | "top-left"
  >("bottom-right");
  const [theme, setTheme] = useState<"black" | "silver" | "u2" | "mnelia">("black");
  const [showEmbedded, setShowEmbedded] = useState(false);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at top, #1e293b, #0f172a, #020617)",
        color: "#f8fafc",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: "48px 24px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: "880px", margin: "0 auto" }}>
        {/* Header */}
        <header style={{ textAlign: "center", marginBottom: "48px" }}>
          <div
            style={{
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: "9999px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              fontSize: "13px",
              fontWeight: 500,
              marginBottom: "16px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            React Component Package
          </div>
          <h1
            style={{
              fontSize: "42px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              margin: "0 0 16px",
              background: "linear-gradient(to right, #ffffff, #94a3b8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            iPod Classic for React
          </h1>
          <p
            style={{
              fontSize: "18px",
              color: "#94a3b8",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Coloca um iPod Classic interativo e funcional em qualquer site React.
            Funciona como <strong>widget flutuante</strong> ou componente embutido,
            com lista de músicas customizada por JSON ou props!
          </p>
        </header>

        {/* Demo Controls Card */}
        <section
          style={{
            background: "rgba(30, 41, 59, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(12px)",
            borderRadius: "20px",
            padding: "28px",
            marginBottom: "36px",
          }}
        >
          <h2 style={{ fontSize: "18px", margin: "0 0 16px", fontWeight: 600 }}>
            🎛️ Experimenta a Configuração
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
            }}
          >
            {/* Position Selector */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  color: "#94a3b8",
                  marginBottom: "8px",
                  fontWeight: 500,
                }}
              >
                Posição do Floating iPod:
              </label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as any)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: "#0f172a",
                  color: "#fff",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  fontSize: "14px",
                  outline: "none",
                }}
              >
                <option value="bottom-right">Inferior Direito (bottom-right)</option>
                <option value="bottom-left">Inferior Esquerdo (bottom-left)</option>
                <option value="top-right">Superior Direito (top-right)</option>
                <option value="top-left">Superior Esquerdo (top-left)</option>
              </select>
            </div>

            {/* Theme Selector */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  color: "#94a3b8",
                  marginBottom: "8px",
                  fontWeight: 500,
                }}
              >
                Tema do iPod:
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: "#0f172a",
                  color: "#fff",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  fontSize: "14px",
                  outline: "none",
                }}
              >
                <option value="black">Black Classic</option>
                <option value="silver">Silver Classic</option>
                <option value="u2">Special U2 Edition (Red Wheel)</option>
                <option value="mnelia">Mnelia Gradient</option>
              </select>
            </div>

            {/* Mode Toggle */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowEmbedded(!showEmbedded)}
                style={{
                  padding: "11px 18px",
                  borderRadius: "10px",
                  background: showEmbedded ? "#3b82f6" : "rgba(255, 255, 255, 0.08)",
                  color: "#fff",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {showEmbedded ? "Ocultar Modo Embutido" : "Ver Modo Embutido na Página"}
              </button>
            </div>
          </div>
        </section>

        {/* Embedded iPod Mode */}
        {showEmbedded && (
          <section
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "32px 0 48px",
              padding: "32px",
              background: "rgba(15, 23, 42, 0.6)",
              borderRadius: "24px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <h3 style={{ margin: "0 0 24px", fontSize: "20px" }}>
              Modo Embutido (`&lt;Ipod /&gt;`)
            </h3>
            <div style={{ width: "370px", height: "620px" }}>
              <Ipod
                songs={samplePlaylist}
                theme={theme}
                showReflection={true}
              />
            </div>
          </section>
        )}

        {/* Code Example Section */}
        <section
          style={{
            background: "#090d16",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "36px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "14px",
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#cbd5e1" }}>
              Como usar no teu site (JSX)
            </span>
            <span
              style={{
                fontSize: "12px",
                color: "#10b981",
                background: "rgba(16, 185, 129, 0.1)",
                padding: "3px 10px",
                borderRadius: "999px",
              }}
            >
              npm install react-ipod-classic
            </span>
          </div>
          <pre
            style={{
              margin: 0,
              padding: "16px",
              background: "#020617",
              borderRadius: "10px",
              overflowX: "auto",
              fontSize: "13px",
              color: "#e2e8f0",
              lineHeight: 1.5,
            }}
          >
{`import { FloatingIpod } from 'react-ipod-classic';

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

      {/* iPod Flutuante */}
      <FloatingIpod
        songs={songs}
        position="${position}"
        theme="${theme}"
        defaultOpen={false}
      />
    </div>
  );
}`}
          </pre>
        </section>

        {/* JSON Remote Example */}
        <section
          style={{
            background: "#090d16",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h3 style={{ fontSize: "16px", margin: "0 0 10px", color: "#cbd5e1" }}>
            Ou carregar via ficheiro JSON (`songsUrl`):
          </h3>
          <pre
            style={{
              margin: 0,
              padding: "16px",
              background: "#020617",
              borderRadius: "10px",
              fontSize: "13px",
              color: "#e2e8f0",
            }}
          >
{`<FloatingIpod
  songsUrl="/demo-songs.json"
  position="bottom-right"
/>`}
          </pre>
        </section>
      </div>

      {/* The Floating iPod itself */}
      <FloatingIpod
        songs={samplePlaylist}
        position={position}
        theme={theme}
        defaultOpen={false}
      />
    </main>
  );
}
