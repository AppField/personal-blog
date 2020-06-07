import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  *, *:before, *:after {
    box-sizing: border-box;
    font-family: Futura, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  body {
    background: var(--color-background);
    color: var(--color-text);    

    font-size: 18px;
  }
  a {
    color: var(--color-primary);
    text-decoration: none;
    box-shadow: none;
    transition: box-shadow 200ms ease-in
  }
  a:hover {
    box-shadow: 0 1px 0 0 currentColor
  }

  blockquote {
    color: var(--color-text);
    border-left-color: var(--color-primary)
  }
`;

export default GlobalStyles;