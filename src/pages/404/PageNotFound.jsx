import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
  const navigate = useNavigate();

  // Handler to redirect to the home page
  const handleRedirect = () => {
    navigate('/');  // Change '/' to the desired route, e.g., '/login' for a login page
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.header}>404</h1>
        <h2 style={styles.subHeader}>Oops! Page Not Found</h2>
        <p style={styles.text}>The page you are looking for might have been removed or is temporarily unavailable.</p>
        <Button 
          type="primary" 
          size="large" 
          style={styles.button} 
          onClick={handleRedirect}
        >
          Go to Homepage
        </Button>
      </div>
    </div>
  );
};

// Styles for the 404 page
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
  },
  content: {
    textAlign: 'center',
    maxWidth: '500px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  header: {
    fontSize: '80px',
    fontWeight: 'bold',
    margin: '0',
    color: '#f5222d',
  },
  subHeader: {
    fontSize: '24px',
    margin: '10px 0',
    color: '#555',
  },
  text: {
    fontSize: '16px',
    color: '#888',
    marginBottom: '20px',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
  },
};

export default PageNotFound;
