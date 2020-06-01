import React from 'react';
import { ThemeProvider } from './theme/themeContext';
import GlobalStyles from './globalStyles';

import Amplify from 'aws-amplify';
import awsConfig from './aws-exports';

Amplify.configure(awsConfig);

function App({ children }) {
  return (
    <ThemeProvider>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
}

export default App;
