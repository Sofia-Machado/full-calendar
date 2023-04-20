import { QueryClientProvider, QueryClient } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { DemoApp } from './components/DemoApp';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ThemeProvider, createTheme } from '@mui/material';
import ClientForm from './components/ClientForm';

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
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<DemoApp />} />
            <Route path='/client/:id' element={<ClientForm />} />
          </Routes>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
