import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  [data-ipod-root] {
    color: #000000;
    color-scheme: light;
  }

  [data-ipod-root] * {
    box-sizing: border-box;
    scrollbar-width: none;
    -ms-overflow-style: none;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif;
  }

  [data-ipod-root] *::-webkit-scrollbar {
    display: none;
  }

  [data-ipod-root] a {
    color: inherit;
    text-decoration: none;
  }
`;
