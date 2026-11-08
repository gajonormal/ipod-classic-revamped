import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  cjsInterop: true,
  shims: true,
  banner: {
    js: '"use client";',
  },
  external: ["react", "react-dom", "styled-components"],
});
