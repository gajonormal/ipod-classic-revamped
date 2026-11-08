import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  [data-ipod-root] {
    color: #000000;
    color-scheme: light;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  }

  [data-ipod-root] * {
    box-sizing: border-box;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }

  [data-ipod-root] *::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
  }

  [data-ipod-root] a {
    color: inherit;
    text-decoration: none;
  }
`;
