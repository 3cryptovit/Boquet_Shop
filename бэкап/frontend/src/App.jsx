import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './shared/routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/base/globals.css';

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
