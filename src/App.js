import {BrowserRouter as Router, Routes, Route, Navigate, useLocation} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.min.css';
import Home from './pages/home/Home';
import Products from './pages/products/Products';
import Cart from './pages/cart/Cart';
import Login from './pages/login/Login';
import Reports from './pages/reports/Reports';
import InvoicesRoute from './pages/invoices/InvoiceRoute';
import Categories from "./pages/categories/Categories"
import PageNotFound from './pages/404/PageNotFound';
import axios from 'axios';
import { message } from 'antd';
import Customer from './pages/customers/Customer';
import Cookies from 'js-cookie';
import { baseUrl } from './utils/url';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRouter> <Home /> </ProtectedRouter>  } />
          <Route path="/products" element={<ProtectedRouter> <Products /> </ProtectedRouter> } />
          <Route path="/cart" element={<ProtectedRouter> <Cart /> </ProtectedRouter>} />
          <Route path="/invoice" element={<ProtectedRouter> <InvoicesRoute /> </ProtectedRouter>} />
          <Route path="/categories" element={<ProtectedRouter> <Categories /> </ProtectedRouter>} />
          <Route path="/customer-detail" element={<ProtectedRouter> <Customer /> </ProtectedRouter>} />
          <Route path="/reports" element={<ProtectedRouter> <Reports /> </ProtectedRouter>} />
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;

export function ProtectedRouter({ children }) {
  const session = Cookies.get('session');
  const [verificationStatus, setVerificationStatus] = useState(null);
  const location = useLocation();
  useEffect(() => {
    const verifyUserExpiry = async () => {
      if (session) {
        setVerificationStatus(true);
      }else{  
        setVerificationStatus(false);
        return;
      }
      
    };

    verifyUserExpiry();
  }, [session, location]);

  if (verificationStatus === null) {
    return <div>Loading...</div>;
  }
  if (verificationStatus === false) {
    return <Navigate to="/login" />;
  }
  return children;
}