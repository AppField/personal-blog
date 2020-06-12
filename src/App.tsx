import React from 'react';
import { ThemeProvider } from './theme/themeContext';
import GlobalStyles from './globalStyles';

import Amplify, { Analytics } from 'aws-amplify';
import awsConfig from './aws-exports';

Amplify.configure(awsConfig);
Analytics.configure(awsConfig);

function App({ children }) {
  return (
    <ThemeProvider>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
}

export default App;
