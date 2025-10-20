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
  --font-logo:  'Inter', -apple-system, sans-serif;

  /* Official styles (Firefox) */
  scrollbar-color: var(--bg-tertiary-hover) transparent;
  scrollbar-width: thin;
  height: 100%;
  
  // cause issues with fixed modal on sentence editing page in Safari and Firefox, fix below
  scrollbar-gutter: stable both-edges;
}

// https://github.com/radix-ui/primitives/issues/1496#issuecomment-1962839229
html body[data-scroll-locked] {
    --removed-body-scroll-bar-size: 0 !important;
    margin-right: 0 !important;
}

/* Vendor prefix for other browsers */
::-webkit-scrollbar {
  background-color: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: var(--bg-tertiary-hover);
}

body {
  font-family: var(--font-family);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  height: 100%;
}
`;

export default GlobalStyles;
