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
  --bg-overlay: hsl(0deg 0% 0% / 93%);
  --bg-loading-overlay: hsl(0deg 0% 0% / 0.5);
	--bg-modal: hsl(0deg 0% 7%);
  --bg-popover: hsl(0deg 0% 19%);
  --bg-dropdown: hsl(0 0% 15%);
  --bg-primary: hsl(0deg 0% 0%);
  --bg-primary-hover: hsl(0deg 0% 9%);
  --bg-secondary: hsl(0 0% 12%);
  --bg-secondary-hover: hsl(0 0% 15%);
  --bg-tertiary: hsl(0 0% 20%);
  --bg-tertiary-hover: hsl(0 0% 23%);
  --bg-revert: hsl(0 0% 98%);
  --bg-status-warning: hsl(25 85% 15%);
  --border-light: hsl(0 0% 100% / 5%);
  --border-medium: hsl(0 0% 100% / 15%);
  --border-status-warning: hsl(25 85% 25%);
  --text-primary: hsl(0 0% 100%);
  --text-secondary: hsl(0 0% 90%);
  --text-tertiary: hsl(0 0% 58%);
  --text-revert: hsl(0deg 0% 5%);
  --text-status-warning: hsl(20 100% 70%);
  --text-status-mark: hsl(54 100% 70%);

  
  --shadow-color: 0deg 0% 0%;
  --shadow-elevation-low:
    0px 0.7px 0.6px hsl(var(--shadow-color) / 0.44),
    0px 0.9px 0.8px -2px hsl(var(--shadow-color) / 0.33),
    0px 2.4px 2.2px -4px hsl(var(--shadow-color) / 0.22);
  --shadow-elevation-medium:
    0px 0.7px 0.6px hsl(var(--shadow-color) / 0.46),
    0px 1.5px 1.4px -1.3px hsl(var(--shadow-color) / 0.37),
    0px 4.4px 4px -2.7px hsl(var(--shadow-color) / 0.29),
    -0.1px 12px 10.8px -4px hsl(var(--shadow-color) / 0.2);
  --shadow-elevation-high:
    0px 0.7px 0.6px hsl(var(--shadow-color) / 0.43),
    0px 1.8px 1.6px -0.6px hsl(var(--shadow-color) / 0.39),
    0px 3.5px 3.2px -1.1px hsl(var(--shadow-color) / 0.35),
    0px 6.7px 6px -1.7px hsl(var(--shadow-color) / 0.31),
    -0.1px 12.4px 11.2px -2.3px hsl(var(--shadow-color) / 0.27),
    -0.1px 21.5px 19.4px -2.9px hsl(var(--shadow-color) / 0.23),
    -0.2px 34.8px 31.3px -3.4px hsl(var(--shadow-color) / 0.19),
    -0.4px 53.3px 48px -4px hsl(var(--shadow-color) / 0.15);

    /* Official styles (Firefox) */
  scrollbar-color:
  var(--bg-tertiary)
  transparent;
  scrollbar-width: thin;
  
}

/* Vendor prefix for other browsers */
::-webkit-scrollbar {
  background-color: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: var(--bg-tertiary);
}

body {
  font-family: var(--font-family);
  background-color: var(--bg-primary);
  color: var(--text-primary);
}
`;

export default GlobalStyles;
