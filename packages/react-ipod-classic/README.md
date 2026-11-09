# 🎵 react-ipod-classic

> An interactive, fully functional iPod Classic music player component for React applications. Drop it in your website as a floating widget or embed it directly into your page.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

- 🎧 **Interactive ClickWheel**: Scroll with mouse or touch gestures around the circular wheel, just like the real hardware.
- 🪟 **Floating Widget Mode (`<FloatingIpod />`)**: Draggable, minimizable floating launcher button that sits on any corner of your site.
- 🎵 **Audio Sources**: Play audio files directly or use YouTube URLs or IDs for videos that allow embedded playback.
- 📂 **Custom Music Library**: Pass your songs via simple props or load them from a JSON file/URL.
- 🎨 **Authentic Themes**: Choose between classic colors: `black`, `silver`, `u2`, or `mnelia`.
- 🔍 **Menus & Views**: Cover Flow, Playlists, Artists, Albums, Songs, Search, Now Playing, and Settings.
- 📱 **Mobile & Touch Friendly**: Haptic feedback on iOS/Android, responsive scaling, touch gestures.

---

## 📦 Installation

Build the package and create its installable archive from the repository root:

```bash
pnpm install
pnpm build:package
npm pack ./packages/react-ipod-classic
```

Copy the archive into your React project, then install it:

```bash
npm install ./react-ipod-classic-0.1.0.tgz styled-components
```

The package uses your site's React and React DOM (18 or 19) and styled-components (6). For the Next.js App Router, use a Client Component when passing callbacks to the player.

---

## 🚀 Quick Start

### 1. Floating iPod Player

Add a floating iPod widget to the bottom-right corner of your website:

```tsx
import React from 'react';
import { FloatingIpod } from 'react-ipod-classic';

export default function App() {
  const mySongs = [
    {
      name: "Never Gonna Give You Up",
      artistName: "Rick Astley",
      albumName: "Whenever You Need Somebody",
      url: "/music/first-track.mp3", // Serve this file from your site
    },
    {
      name: "Bohemian Rhapsody",
      artistName: "Queen",
      albumName: "A Night at the Opera",
      url: "/music/second-track.mp3",
    },
  ];

  return (
    <div>
      <h1>My Website</h1>

      <FloatingIpod
        songs={mySongs}
        position="bottom-right"
        theme="black"
        defaultOpen={false}
      />
    </div>
  );
}
```

---

### 2. Embedded iPod Player

If you want the iPod to render directly inside your layout:

```tsx
import React from 'react';
import { Ipod } from 'react-ipod-classic';

export default function MusicPage() {
  return (
    <div style={{ height: "650px", width: "400px", margin: "0 auto" }}>
      <Ipod
        songs={[
          {
            name: "Starboy",
            artistName: "The Weeknd",
            url: "/music/track.mp3", // Serve this file from your site
          }
        ]}
        theme="silver"
        showReflection={true}
      />
    </div>
  );
}
```

---

### 3. Load Songs from a JSON File or Remote URL

You can host a `songs.json` file on your server (or in your `public/` folder) and pass `songsUrl`:

```tsx
<FloatingIpod
  songsUrl="/playlist.json"
  position="bottom-right"
/>
```

Example `playlist.json`:
```json
[
  {
    "name": "Feel Good Inc.",
    "artistName": "Gorillaz",
    "albumName": "Demon Days",
    "url": "HyHNuVaZJ-k",
    "artwork": {
      "url": "https://i.ytimg.com/vi/HyHNuVaZJ-k/hqdefault.jpg"
    }
  },
  {
    "name": "Midnight City",
    "artistName": "M83",
    "albumName": "Hurry Up, We're Dreaming",
    "url": "dX3k_QDnzHE"
  }
]
```

---

## 🎛️ Component Props

### `<FloatingIpod />` Props

Inherits all `<Ipod />` props below, plus:

| Prop | Type | Default | Description |
|---|---|---|---|
| `position` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Corner of the screen for the floating button. |
| `defaultOpen` | `boolean` | `false` | Whether the iPod opens automatically when mounted. |
| `buttonContent` | `React.ReactNode` | — | Custom content/label for the floating launcher button. |
| `zIndex` | `number` | `999999` | CSS `z-index` for the floating layer. |
| `offset` | `{ x?: number, y?: number }` | `{ x: 24, y: 24 }` | Distance in pixels from screen edges. |
| `onOpenChange` | `(isOpen: boolean) => void` | — | Fired when widget is opened or closed. |

### `<Ipod />` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `songs` | `IpodSong[]` | default songs | Array of song objects. |
| `songsUrl` | `string` | — | URL to fetch songs JSON from. |
| `playlists` | `IpodPlaylist[]` | — | Custom playlists grouping songs. |
| `theme` | `'black' \| 'silver' \| 'u2' \| 'mnelia'` | `'black'` | iPod shell and click wheel theme. |
| `showReflection` | `boolean` | `false` | Shows a stylish reflection below the shell. |
| `disableAnimation` | `boolean` | `false` | Disables entry drop animation. |
| `albums` | `IpodAlbum[]` | — | Custom albums with songs or references to songs by ID. |
| `parentOrigin` | `string` | — | Trusted iframe parent origin for playback commands and state updates. |
| `onSongChange` | `(song: Song) => void` | — | Fired when currently playing song changes. |
| `onPlayStateChange` | `(isPlaying: boolean) => void` | — | Fired when play/pause state changes. |

---

## 🎵 Song Object Format (`IpodSong`)

```typescript
interface IpodSong {
  name: string;             // Song title (required)
  url: string;              // Direct audio URL, YouTube ID or YouTube URL (required)
  artistName?: string;      // Artist name
  albumName?: string;       // Album title
  duration?: number;        // Track duration in seconds
  artwork?: {
    url: string;            // Custom album cover image URL
  };
}
```

Direct audio URLs can be absolute or relative to the page, such as `/music/track.mp3`. Supply `artwork` for a custom cover. YouTube tracks use the video thumbnail by default.

---

## 🕹️ Controls Guide

- **ClickWheel Rotation**: Move mouse or drag finger along the circular track to scroll up/down.
- **Center Button**: Select item / Enter.
- **MENU Button**: Go back to previous menu (long press returns to Home).
- **Play/Pause Button**: Toggle playback.
- **Rewind / Fast-Forward**: Skip to previous / next song.
- **Keyboard Shortcuts**: Arrow keys (Up/Down to scroll, Right/Enter to select, Left/Escape for Menu).

---

## 📄 License

MIT. A fork of Tanner Villarete's React project [ipod-classic-js](https://github.com/tvillarete/ipod-classic-js), packaged as a reusable component by [gajonormal](https://github.com/gajonormal).


## Decorative previews

Use `<Ipod interactive={false} />` to render a decorative device without input listeners or audio playback.

`googleClientId` is reserved for compatibility and does not initialize a sign-in flow.

When embedding the demo, use `/embed?parentOrigin=https%3A%2F%2Fexample.com` to set the parent origin explicitly. Otherwise the player uses the browser referrer when available, with its own origin as the fallback. Commands must come from the immediate parent window.
