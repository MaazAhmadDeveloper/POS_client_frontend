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
  const [verificationStatus, setVerificationStatus] = useState(null); // null: loading, true: verified, false: not verified
  const storage = localStorage.getItem('user');
  const location = useLocation();

  useEffect(() => {
    console.log("switched");
    const verifyUserExpiry = async () => {
      if (!storage) {
        setVerificationStatus(false); // No user found in localStorage, so we redirect
        return;
      }

      try {
        const { data } = await axios.get(`https://pos-client-backend-oy6t.vercel.app/api/userAuth/checkUser/${storage}`);

        if (data.verification_code === 0 || data.verification_code === 2) {
          message.error(data.message);
          localStorage.removeItem('user');
          setVerificationStatus(false); // User is not verified or expired
        } else if (data.verification_code === 1) {
          setVerificationStatus(true); // User is verified
        }
      } catch (error) {
        console.error("Error during verification:", error);
        setVerificationStatus(false); // On error, consider the user not verified
      }
    };

    verifyUserExpiry();
  }, [storage, location]);

  if (verificationStatus === null) {
    // Loading state while checking verification
    return <div>Loading...</div>;
  }

  if (verificationStatus === false) {
    // Redirect to login if the user is not verified or there was an error
    return <Navigate to="/login" />;
  }

  // Render children only when verification_code is 1
  return children;
}