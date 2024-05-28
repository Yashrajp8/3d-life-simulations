import React from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import AlgorithmicLife from './components/AlgorithmicLife';
import Header from './components/Header';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Container>
        <AlgorithmicLife />
      </Container>
    </ThemeProvider>
  );
}

export default App;
