import React from 'react';

const FloatingWhatsApp = () => {
  return (
    <a
      href="https://wa.me/94750906149" 
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '180px',
        right: '20px',
        width: '60px',
        height: '60px',
        backgroundColor: '#25D366',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        zIndex: 9999,
        cursor: 'pointer'
      }}
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
        style={{ width: '30px', height: '30px' }}
      />
    </a>
  );
};

export default FloatingWhatsApp;
