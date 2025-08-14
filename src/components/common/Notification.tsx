import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import './Notification.css';

const Notification: React.FC = () => {
  const { state, hideNotification } = useApp();

  useEffect(() => {
    if (state.notification?.isVisible) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [state.notification?.isVisible, hideNotification]);

  if (!state.notification?.isVisible) {
    return null;
  }

  const getIcon = () => {
    if (!state.notification) return 'bi-info-circle-fill';

    switch (state.notification.type) {
      case 'success':
        return 'bi-check-circle-fill';
      case 'error':
        return 'bi-exclamation-triangle-fill';
      case 'warning':
        return 'bi-exclamation-triangle-fill';
      case 'info':
      default:
        return 'bi-info-circle-fill';
    }
  };

  return (
    <div className={`notification notification-${state.notification.type}`}>
      <div className="notification-content">
        <i className={`bi ${getIcon()} notification-icon`}></i>
        <span className="notification-message">
          {state.notification.message}
        </span>
        <button 
          className="notification-close"
          onClick={hideNotification}
          aria-label="Đóng thông báo"
        >
          <i className="bi bi-x"></i>
        </button>
      </div>
    </div>
  );
};

export default Notification;
