import React, { useEffect } from 'react';
import Navigation from '../components/Navigation';
import { useSocket } from '../context/SocketContext';
import './Notifications.css';

const Notifications = () => {
  const { notifications, markNotificationsAsRead } = useSocket();

  // Sayfa açıldığında bildirimleri okundu işaretle
  useEffect(() => {
    markNotificationsAsRead();
  }, [markNotificationsAsRead]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like': return '❤️';
      case 'comment': return '💬';
      case 'follow': return '👤';
      case 'mention': return '📢';
      default: return '🔔';
    }
  };

  const getNotificationText = (notification) => {
    switch (notification.type) {
      case 'like': return 'gönderinizi beğendi';
      case 'comment': return 'gönderinize yorum yaptı';
      case 'follow': return 'sizi takip etti';
      case 'mention': return 'sizden bahsetti';
      default: return 'yeni bir etkileşimde bulundu';
    }
  };

  // Örnek bildirimler (socket'ten gelene kadar)
  const sampleNotifications = [
    { id: 1, type: 'like', fromUsername: 'Ahmet Yılmaz', time: '2 dakika önce' },
    { id: 2, type: 'comment', fromUsername: 'Ayşe Demir', time: '1 saat önce' },
    { id: 3, type: 'follow', fromUsername: 'Mehmet Kaya', time: '3 saat önce' },
  ];

  const displayNotifications = notifications.length > 0 ? notifications : sampleNotifications;

  return (
    <div className="notifications-container">
      <Navigation />
      
      <main className="notifications-content">
        <div className="notifications-header">
          <h1>Bildirimler</h1>
          {notifications.length > 0 && (
            <button onClick={markNotificationsAsRead} className="mark-read-btn">
              Tümünü Okundu İşaretle
            </button>
          )}
        </div>

        <div className="notifications-list">
          {displayNotifications.length > 0 ? (
            displayNotifications.map((notification, index) => (
              <div key={notification.id || index} className="notification-item">
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="notification-content">
                  <p>
                    <strong>{notification.fromUsername || 'Bir kullanıcı'}</strong>
                    {' '}{getNotificationText(notification)}
                  </p>
                  <span className="notification-time">
                    {notification.time || 'Yeni'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-notifications">
              <p>Henüz bildirim yok</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Notifications;