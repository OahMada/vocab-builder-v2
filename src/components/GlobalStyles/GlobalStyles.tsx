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
  --bg-overlay: hsl(0 0% 0% / 70%);
	--bg-modal: hsl(0 0% 11%);
  --bg-primary: hsl(0 0% 13%);
  --bg-popover: hsl(0 0% 15%);
  --bg-primary-hover: hsl(0 0% 18%);
  --bg-secondary: hsl(0 0% 20%);
  --bg-secondary-hover: hsl(0 0% 23%);
  --bg-tertiary: hsl(0 0% 25%);
  --bg-tertiary-hover: hsl(0 0% 38%);
  --bg-revert: hsl(0 0% 98%);
  --bg-status-warning: hsl(25 85% 15%);
  --border-light: hsl(0 0% 100% / 5%);
  --border-medium: hsl(0 0% 100% / 15%);
  --border-status-warning: hsl(25 85% 25%);
  --text-primary: hsl(0 0% 100%);
  --text-secondary: hsl(0 0% 90%);
  --text-tertiary: hsl(0 0% 60%);
  --text-revert: hsl(0 0% 5%);
  --text-status-warning: hsl(20 100% 70%);

  
  --shadow-color: 0deg 0% 5%;
  --shadow-elevation-low:
    0px 0.7px 0.6px hsl(var(--shadow-color) / 0.44),
    0px 0.9px 0.8px -2px hsl(var(--shadow-color) / 0.33),
    0px 2.4px 2.2px -4px hsl(var(--shadow-color) / 0.22);
  --shadow-elevation-medium:
    0px 0.7px 0.6px hsl(var(--shadow-color) / 0.46),
    0px 1.4px 1.3px -1.3px hsl(var(--shadow-color) / 0.37),
    0px 4.3px 3.9px -2.7px hsl(var(--shadow-color) / 0.29),
    -0.1px 11.8px 10.6px -4px hsl(var(--shadow-color) / 0.2);
  --shadow-elevation-high:
    0px 0.7px 0.6px hsl(var(--shadow-color) / 0.43),
    0px 1.8px 1.6px -0.6px hsl(var(--shadow-color) / 0.39),
    0px 3.5px 3.2px -1.1px hsl(var(--shadow-color) / 0.35),
    0px 6.6px 5.9px -1.7px hsl(var(--shadow-color) / 0.31),
    -0.1px 12.2px 11px -2.3px hsl(var(--shadow-color) / 0.27),
    -0.1px 21.1px 19px -2.9px hsl(var(--shadow-color) / 0.23),
    -0.2px 34.2px 30.8px -3.4px hsl(var(--shadow-color) / 0.19),
    -0.4px 52.5px 47.3px -4px hsl(var(--shadow-color) / 0.15);
}

body {
  font-family: var(--font-family);
  background-color: var(--bg-primary);
}
`;

export default GlobalStyles;
