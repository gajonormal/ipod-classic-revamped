<div align="center">

# iPod Classic Revamped 🎵

**The iconic iPod Classic, rebuilt for the modern web and powered by YouTube Music.**

This is a heavily modified fork of Tanner Villarete's brilliant [ipod-classic-js](https://github.com/tvillarete/ipod-classic-js), revamped by **gajonormal** to serve as a standalone interactive portfolio component.

![ipod](https://user-images.githubusercontent.com/21055469/71572818-c877a780-2a95-11ea-9e4e-6b0476ff172b.gif)

</div>

---

## ✨ What's New in this Revamp?

I completely gutted the original music engine and visual aesthetic to create a more authentic, standalone experience:

- **Powered by YouTube Music**: Replaced the legacy Apple Music and Spotify integrations with a custom YouTube scraping engine (via `youtubei.js` and `@tanstack/react-query`).
- **Google OAuth Login**: Users can log in with their Google account to instantly fetch and play their own YouTube Music library.
- **Hybrid / Guest Mode**: No login required! If no account is linked, the iPod boots into a custom **Default Library** featuring 4 hand-picked albums (Kanye West, Frank Ocean, Yung Lean, etc.) that work perfectly out of the box.
- **Retro LCD Aesthetics**: Added an authentic retro screen filter with subtle scanlines, RGB subpixel emulation, and screen glare for that nostalgic 2000s hardware feel.
- **Portfolio Ready**: Cleaned up the entire codebase (removing thousands of lines of dead Apple/Spotify types and logic) and optimized it to be seamlessly embedded as an `iframe` component.

## 🚀 Quick Start

```bash
pnpm install
pnpm dev
```

Visit **[http://localhost:3000/ipod](http://localhost:3000/ipod)** to start.

## ⚙️ Configuration

Create a `.env.local` file in the root directory to enable Google Login:

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### Google OAuth Setup
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project and configure the OAuth consent screen.
3. Create OAuth client ID credentials (Web application).
4. Add `http://localhost:3000` to Authorized JavaScript origins.
5. Copy your Client ID into the `.env.local` file.

## 🌐 Embedding as an Iframe

This project is specifically tailored to be deployed on Vercel and embedded into other sites (like portfolios) via an iframe to prevent CSS/React conflicts:

```html
<iframe
  src="https://your-deployed-url.vercel.app"
  style="width: 370px; height: 600px; border: none; border-radius: 30px; background: transparent;"
  allow="autoplay; encrypted-media; clipboard-read; clipboard-write"
  title="iPod Classic Revamped"
></iframe>
```

## 🛠 Built With

- **Framework**: Next.js (React), TypeScript
- **Styling**: Styled Components, Motion
- **Data & APIs**: `@tanstack/react-query`, `youtubei.js`, Google OAuth

## 📝 Credits & License

- Original project and UI implementation by **[Tanner Villarete](https://github.com/tvillarete/ipod-classic-js)**.
- Music Engine migration, visual tweaks, and portfolio adaptation by **gajonormal**.

Released under the MIT License.
