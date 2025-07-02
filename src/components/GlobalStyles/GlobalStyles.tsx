'use client';

import { createGlobalStyle } from 'styled-components';

var GlobalStyles = createGlobalStyle`
/*
  Josh's Custom CSS Reset
  https://www.joshwcomeau.com/css/custom-css-reset/
*/

*, *::before, *::after {
  box-sizing: border-box;
}

* {
  margin: 0;
}

@media (prefers-reduced-motion: no-preference) {
  html {
    interpolate-size: allow-keywords;
  }
}

body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

input, button, textarea, select {
  font: inherit;
}

p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
}

p {
  text-wrap: pretty;
}
h1, h2, h3, h4, h5, h6 {
  text-wrap: balance;
}


/* custom properties */
html {
  --font-family: "Roboto", -apple-system, sans-serif;
  --bg-primary: hsl(0 0% 13%);
  --bg-secondary: hsl(0 0% 20%);
  --bg-tertiary: hsl(0 0% 25%);
  --bg-tertiary-hover: hsl(0 0% 38%);
  --border-light: hsl(0 0% 100% / 5%);
  --border-medium: hsl(0 0% 100% / 15%);
  --text-primary: hsl(0 0% 100%);
  --text-secondary: hsl(0 0% 95%);
  --text-tertiary: hsl(0 0% 60%);
}

body {
  font-family: var(--font-family);
  background-color: var(--bg-primary);
}
`;

export default GlobalStyles;
