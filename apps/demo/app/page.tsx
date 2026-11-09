"use client";

import { useState } from "react";
import Image from "next/image";
import type { FloatingIpodProps } from "react-ipod-classic";
import { FloatingIpod, Ipod } from "./components/ClientIpod";
import samplePlaylist from "../public/demo-songs.json";
import styles from "./page.module.css";

const finishes = [
  { value: "silver", label: "Silver" },
  { value: "black", label: "Black" },
] as const;

export default function Page() {
  const [theme, setTheme] = useState<(typeof finishes)[number]["value"]>("silver");
  const [position, setPosition] =
    useState<NonNullable<FloatingIpodProps["position"]>>("bottom-right");
  const [mode, setMode] = useState<"embedded" | "floating">("embedded");
  const [useJsonUrl, setUseJsonUrl] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [codeTab, setCodeTab] = useState<"react" | "json">("react");
  const playerProps = {
    theme,
    songs: useJsonUrl ? undefined : samplePlaylist,
    songsUrl: useJsonUrl ? "/demo-songs.json" : undefined,
  };
  const source = useJsonUrl
    ? 'songsUrl="/demo-songs.json"'
    : "songs={playlist}";
  const code = `import { ${mode === "floating" ? "FloatingIpod" : "Ipod"} } from 'react-ipod-classic';\n\n${useJsonUrl ? "" : `const playlist = ${JSON.stringify(samplePlaylist.slice(0, 2), null, 2)};\n\n`}export default function App() {\n  return (\n    <${mode === "floating" ? "FloatingIpod" : "Ipod"}\n      ${source}\n      theme="${theme}"${mode === "floating" ? `\n      position="${position}"` : "\n      style={{ width: 320, height: 510 }}"}\n    />\n  );\n}`;

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(
        codeTab === "react" ? code : JSON.stringify(samplePlaylist, null, 2)
      );
      setCopied(true);
      setCopyError(false);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError(true);
    }
  }

  return (
    <div className={styles.page} id="overview">
      <a className={styles.skipLink} href="#demo">
        Skip to demo
      </a>
      <div className={styles.site}>
        <header>
          <nav className={styles.globalNav} aria-label="Main navigation">
            <a
              className={styles.brandMark}
              href="#overview"
              aria-label="iPod.js — home"
            >
              <Image
                src="/logochrome.svg"
                alt=""
                width={25}
                height={29}
                unoptimized
              />
            </a>
            <a className={styles.currentNav} href="#overview">
              iPod + React
            </a>
            <a href="#demo">Try it</a>
            <a href="#config">Customize</a>
            <a href="#docs">Documentation</a>
            <a
              href="https://github.com/gajonormal/ipod-classic-revamped"
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
          </nav>
          <div className={styles.productNav}>
            <a href="#overview" className={styles.productName}>
              iPod<span>classic for React</span>
            </a>
            <div>
              <a href="#demo">Overview</a>
              <a href="#docs">Installation</a>
              <a className={styles.aquaButton} href="#demo">
                Try it now
              </a>
            </div>
          </div>
        </header>
        <main>
          <section className={styles.hero} aria-labelledby="hero-title">
            <h1 id="hero-title">A classic. A new stage.</h1>
            <p>Your music. Your website. The same click wheel.</p>
            <a href="#docs" className={styles.heroLink}>
              Meet the iPod built for React <span>›</span>
            </a>
            <div className={styles.stage} id="demo">
              <div className={styles.devicePair}>
                <div className={styles.companionDevice}>
                  <Ipod
                    songs={samplePlaylist}
                    theme={theme === "silver" ? "black" : "silver"}
                    interactive={false}
                    showReflection
                    disableAnimation
                  />
                </div>
                <div className={styles.liveDevice}>
                  <Ipod
                    key={mode}
                    {...playerProps}
                    interactive={mode === "embedded"}
                    showReflection
                    disableAnimation
                  />
                </div>
              </div>
              {mode === "floating" && (
                <p className={styles.floatingNote}>
                  Your iPod is in the corner of the window.
                </p>
              )}
            </div>
          </section>
          <section
            className={styles.workbench}
            id="config"
            aria-labelledby="config-title"
          >
            <div className={styles.sectionBar}>
              <h2 id="config-title">Your iPod. Your way.</h2>
              <span>Customize it. Make it yours.</span>
            </div>
            <div className={styles.workbenchBody}>
              <aside className={styles.settings}>
                <h3>Make it yours.</h3>
                <p>Your changes appear in the demo and the code.</p>
                <fieldset>
                  <legend>Display mode</legend>
                  <div className={styles.segmented}>
                    <button
                      aria-pressed={mode === "embedded"}
                      onClick={() => setMode("embedded")}
                    >
                      Embedded
                    </button>
                    <button
                      aria-pressed={mode === "floating"}
                      onClick={() => setMode("floating")}
                    >
                      Floating
                    </button>
                  </div>
                </fieldset>
                <label htmlFor="finish">Finish</label>
                <select
                  id="finish"
                  value={theme}
                  onChange={(event) =>
                    setTheme(event.target.value as typeof theme)
                  }
                >
                  {finishes.map((finish) => (
                    <option key={finish.value} value={finish.value}>
                      {finish.label}
                    </option>
                  ))}
                </select>
                <label htmlFor="position">Floating player position</label>
                <select
                  id="position"
                  value={position}
                  disabled={mode !== "floating"}
                  onChange={(event) =>
                    setPosition(event.target.value as typeof position)
                  }
                >
                  <option value="bottom-right">Bottom right</option>
                  <option value="bottom-left">Bottom left</option>
                  <option value="top-right">Top right</option>
                  <option value="top-left">Top left</option>
                </select>
                <label htmlFor="source">Music source</label>
                <select
                  id="source"
                  value={useJsonUrl ? "json" : "props"}
                  onChange={(event) =>
                    setUseJsonUrl(event.target.value === "json")
                  }
                >
                  <option value="props">Playlist via props</option>
                  <option value="json">JSON file</option>
                </select>
                <a href="#demo" className={styles.textLink}>
                  View my configuration ↑
                </a>
              </aside>
              <div className={styles.documentation} id="docs">
                <div className={styles.docsIntro}>
                  <div>
                    <h3>
                      A little nostalgia.
                      <br />A few lines of React.
                    </h3>
                    <p>Install the component and add your playlist.</p>
                  </div>
                  <span className={styles.reactBadge}>React 18 + 19</span>
                </div>
                <div className={styles.installCommand}>
                  <span>$</span>
                  <code>npm install ./react-ipod-classic-0.1.0.tgz styled-components</code>
                </div>
                <div className={styles.codeHeader}>
                  <div role="tablist" aria-label="Integration examples">
                    <button
                      role="tab"
                      id="react-tab"
                      aria-controls="code-panel"
                      aria-selected={codeTab === "react"}
                      onClick={() => {
                        setCodeTab("react");
                        setCopied(false);
                      }}
                    >
                      React
                    </button>
                    <button
                      role="tab"
                      id="json-tab"
                      aria-controls="code-panel"
                      aria-selected={codeTab === "json"}
                      onClick={() => {
                        setCodeTab("json");
                        setCopied(false);
                      }}
                    >
                      JSON playlist
                    </button>
                  </div>
                  <button className={styles.copyButton} onClick={copyCode}>
                    {copied ? "Copied ✓" : "Copy code"}
                  </button>
                </div>
                <pre
                  className={styles.code}
                  id="code-panel"
                  role="tabpanel"
                  aria-labelledby={`${codeTab}-tab`}
                  tabIndex={0}
                >
                  <code>
                    {codeTab === "react"
                      ? code
                      : JSON.stringify(samplePlaylist, null, 2)}
                  </code>
                </pre>
                <p className={styles.codeNote} role="status">
                  {copyError
                    ? "Could not copy. You can select the code above."
                    : copied
                      ? "Code copied to clipboard."
                      : "Use your own audio URLs. In Next.js, add the player to a Client Component."}
                </p>
                <a
                  href="/demo-songs.json"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.textLink}
                >
                  Open sample playlist ↗
                </a>
              </div>
            </div>
          </section>
          <div className={styles.closing}>
            <span>Designed for the web. Inspired by a classic.</span>
            <a
              href="https://github.com/gajonormal/ipod-classic-revamped/tree/master/packages/react-ipod-classic"
              target="_blank"
              rel="noreferrer"
            >
              Explore the component on GitHub ›
            </a>
          </div>
        </main>
        <footer className={styles.footer}>
          <div>
            <a href="#overview">iPod.js</a>
            <span>An iPod Classic built for the web.</span>
            <a href="#docs">Documentation</a>
            <a
              href="https://github.com/gajonormal/ipod-classic-revamped"
              target="_blank"
              rel="noreferrer"
            >
              Source code ↗
            </a>
          </div>
          <p>
            Independent and open source. Not affiliated with Apple Inc. iPod is
            a trademark of Apple Inc.
          </p>
          <p>
            A fork of{" "}
            <a
              href="https://github.com/tvillarete/ipod-classic-js"
              target="_blank"
              rel="noreferrer"
            >
              ipod-classic-js
            </a>{" "}
            by Tanner Villarete. Packaged as a reusable component by{" "}
            <a
              href="https://github.com/gajonormal/ipod-classic-revamped"
              target="_blank"
              rel="noreferrer"
            >
              gajonormal
            </a>
            .
          </p>
          <p>Built with React. Shared under the MIT license.</p>
        </footer>
      </div>
      {mode === "floating" && (
        <FloatingIpod
          {...playerProps}
          position={position}
          defaultOpen
          buttonContent="Open iPod"
        />
      )}
    </div>
  );
}
