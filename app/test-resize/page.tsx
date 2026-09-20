"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Ipod } from "@/components/Ipod";

export default function TestResizePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 800 });

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: Math.round(entry.contentRect.width),
          height: Math.round(entry.contentRect.height)
        });
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh", padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "black", marginBottom: "0.5rem" }}>iPod Resize Test</h1>
      
      <div style={{ 
        backgroundColor: "#007AFF", 
        color: "white", 
        padding: "0.5rem 1.5rem", 
        borderRadius: "20px",
        fontWeight: "bold",
        fontSize: "1.2rem",
        marginBottom: "1rem",
        boxShadow: "0 4px 10px rgba(0, 122, 255, 0.3)"
      }}>
        Tamanho Atual: {dimensions.width}px × {dimensions.height}px
      </div>

      <p style={{ color: "#333", marginBottom: "2rem", textAlign: "center" }}>
        Arraste o canto inferior direito do container abaixo (linha tracejada) para redimensionar o iPod livremente. <br/>
        Ele vai se ajustar perfeitamente ao tamanho da caixa.
      </p>
      
      <div 
        ref={containerRef}
        style={{ 
          resize: "both", 
          overflow: "hidden", 
          border: "3px dashed #888", 
          width: "400px", 
          height: "800px", 
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f0f0f0",
          boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
          position: "relative"
        }}
      >
        <Suspense fallback={<div style={{ color: "black" }}>Loading iPod...</div>}>
          <Ipod />
        </Suspense>
        
        {/* Resize handle hint */}
        <div style={{ position: "absolute", bottom: "5px", right: "5px", pointerEvents: "none", color: "#888", fontSize: "20px" }}>
          ↘
        </div>
      </div>
    </div>
  );
}
