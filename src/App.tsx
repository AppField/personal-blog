import React from "react"
import { ThemeProvider } from "./theme/themeContext"
import GlobalStyles from "./globalStyles"

function App({ children }) {
  return (
    <ThemeProvider>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  )
}

export default App
