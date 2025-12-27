// src/components/NotificationToast.jsx - BASİT VERSİYON
import React from 'react';

function NotificationToast({ message, onClose }) {
  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      backgroundColor: '#28a745',
      color: 'white',
      padding: '15px 20px',
      borderRadius: '5px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      minWidth: '300px',
      animation: 'slideIn 0.3s ease-out'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>🔔 {message}</span>
        <button 
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '0',
            marginLeft: '10px'
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default NotificationToast;