import { QueryClientProvider, QueryClient } from 'react-query';
import './App.css';
import { DemoApp } from './components/DemoApp';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ThemeProvider, createTheme } from '@mui/material';

const queryClient = new QueryClient();
const theme = createTheme({ 
  typography: {
    fontFamily: 'Montserrat, Verdana, Geneva, Tahoma, sans-serif',
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <DemoApp />
        <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
