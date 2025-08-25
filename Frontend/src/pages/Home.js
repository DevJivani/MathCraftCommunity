import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
 

  return ( 
    <div style={styles.container}>
      <canvas ref={canvasRef} style={styles.canvas}></canvas>
      <div style={styles.content}>
        <h1 style={styles.title}>Welcome to Math Craft</h1>
        <p style={styles.subtitle}>Explore the beauty of mathematics</p>
        <div style={styles.buttonContainer}>
          <Link to="/login" style={styles.link}>
            <button ref={loginButtonRef} style={styles.button}>Login</button>
          </Link>
          <Link to="/signup" style={styles.link}>
            <button ref={signupButtonRef} style={styles.button}>Sign Up</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#f0f8ff',
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center',
  },
  title: {
    fontSize: '4rem',
    color: '#333',
    marginBottom: '1rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
  },
  subtitle: {
    fontSize: '1.5rem',
    color: '#666',
    marginBottom: '2rem',
  },
  buttonContainer: {
    display: 'flex',
    gap: '20px',
  },
  button: {
    padding: '12px 24px',
    fontSize: '1rem',
    cursor: 'pointer',
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    opacity: '0',
    transform: 'translateY(20px)',
    ':hover': {
      backgroundColor: '#357abd',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 8px rgba(0,0,0,0.15)',
    },
  },
  link: {
    textDecoration: 'none',
  },
};

export default Home;