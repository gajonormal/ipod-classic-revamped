# iPod Classic Revamped

An interactive iPod Classic player for React, with a demo inspired by the Apple website of 2007.

A fork of Tanner Villarete's React project [ipod-classic-js](https://github.com/tvillarete/ipod-classic-js), packaged as a reusable component by [gajonormal](https://github.com/gajonormal). Licensed under MIT.

## Workspace

- `packages/react-ipod-classic`: the reusable player, themes, music library, and controls.
- `apps/demo`: the Next.js landing page, configuration examples, and embed route. All routes use the shared package.
- `scripts/generate-assets.js`: embeds player assets from `apps/demo/public` into the package so consuming sites do not need to host them separately.

## Development

```sh
pnpm install
pnpm build:package
pnpm dev
```

Open [localhost:3000](http://localhost:3000). Rebuild the package after changing its source, or run `pnpm --filter react-ipod-classic dev` in another terminal to watch for changes.

Available routes:

- `/`: landing page, interactive demo, configuration, and React examples.
- `/embed`: full-window player for [HTML embeds with custom playlists](packages/react-ipod-classic/README.md#embed-in-html).
- `/test-resize`: manual responsive sizing playground.
- `/~offline`: offline fallback.

## Checks and builds

```sh
pnpm lint
pnpm type-check
pnpm build
```

`pnpm build` builds the package first, then the demo and its service worker. Use `pnpm generate:assets` after changing the player assets listed in the generator.

## Using the component

See the [component documentation](packages/react-ipod-classic/README.md) for installation, props, floating mode, playlists, and Next.js integration.

Songs can be supplied through `songs` or `songsUrl`. Use direct audio URLs or YouTube videos that allow embedded playback. The demo uses local MP3 files and runs without streaming service credentials.

## Deployment

The demo includes OpenNext/Cloudflare configuration. From `apps/demo`, use `pnpm preview` to build and preview the Worker or `pnpm cf-deploy` to deploy it. Set `NEXT_PUBLIC_APP_URL` to the site's public origin for metadata.
