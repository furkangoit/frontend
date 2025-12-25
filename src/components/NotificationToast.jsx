import React from 'react';
import { FaHeart, FaComment, FaUserPlus, FaUserMinus } from 'react-icons/fa';

const NotificationToast = ({ notification, onClose }) => {
  const getNotificationText = () => {
    switch (notification.type) {
      case 'like':
        return `${notification.fromUsername} gönderinizi beğendi`;
      case 'comment':
        return `${notification.fromUsername} gönderinize yorum yaptı`;
      case 'follow':
        return `${notification.fromUsername} sizi takip etmeye başladı`;
      case 'unlike':
        return `${notification.fromUsername} beğenisini kaldırdı`;
      default:
        return 'Yeni bildirim';
    }
  };

  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'like':
        return <FaHeart className="text-red-500" />;
      case 'comment':
        return <FaComment className="text-blue-500" />;
      case 'follow':
        return <FaUserPlus className="text-green-500" />;
      case 'unlike':
        return <FaUserMinus className="text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[300px] max-w-md z-50 animate-slideIn">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3 text-xl">
          {getNotificationIcon()}
        </div>
        <div className="flex-1">
          <p className="text-gray-800 font-medium">{getNotificationText()}</p>
          <p className="text-gray-500 text-sm mt-1">
            {new Date(notification.timestamp).toLocaleTimeString('tr-TR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 ml-2"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;