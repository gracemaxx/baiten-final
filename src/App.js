import { Container, CssBaseline, Paper, ThemeProvider } from '@material-ui/core';
import React, { useContext } from 'react';
import { Store } from './Store';
import { createTheme } from '@material-ui/core';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import HomeScreen from './screens/HomeScreen';
import OrderScreen from './screens/OrderScreen';
import ReviewScreen from './screens/ReviewScreen';
import SelectPaymentScreen from './screens/SelectPaymentScreen';
import PaymentScreen from './screens/PaymentScreen';
import CompleteOrderScreen from './screens/CompleteOrderScreen';
import AdminScreen from './screens/AdminScreen';
import ContentManageScreen from './screens/­ContentManageScreen';

const theme = createTheme({
  typography: {
    h1: { fontWeight: 'bold' },
    h2: {
      fontSize: '2rem',
      color: 'black',
    },
    h3: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: 'white',
    },
  },
  palette: {
    primary: { main: '#eac4d5' },                  
    secondary: {                  
      main: '#b8e0d2 ',                  
      contrastText: 'black',                  
    },                  
  },                  
});                  

function App() { 
  const { state } = useContext(Store);            
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth={state.widthScreen ? 'lg' : 'sm'}>
          <Paper>
            <Routes>  
              <Route path="/" element={<HomeScreen />} exact></Route>
              <Route path="/order" element={<OrderScreen />} exact></Route>
              <Route path="/review" element={<ReviewScreen />} exact></Route>
              <Route path="/select-payment" element={<SelectPaymentScreen />} exact></Route>
              <Route path="/payment" element={<PaymentScreen />} exact></Route>
              <Route path="/complete" element={<CompleteOrderScreen />} exact></Route>
              <Route path="/admin" element={<AdminScreen />} exact></Route>
              <Route path="/content-manage" element={<ContentManageScreen />} exact></Route>
            </Routes>
          </Paper>
        </Container>
      </ThemeProvider>
    </BrowserRouter>
  );
}
export default App;
