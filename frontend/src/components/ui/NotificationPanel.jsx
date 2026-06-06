import React, { useState, useEffect } from 'react';
import { Bell, X, Film, Tv, Star, TrendingUp, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock notifications data (in production, this would come from backend)
const mockNotifications = [
  {
    id: 1,
    type: 'new-release',
    title: 'New Release Alert!',
    message: 'The latest season of "Stranger Things" is now available',
    itemId: 66732,
    mediaType: 'tv',
    image: 'https://image.tmdb.org/t/p/w92/49WJFeN5mMCdU2oJ8c53mF2x3D7.jpg',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    read: false,
  },
  {
    id: 2,
    type: 'trending',
    title: 'Trending Now',
    message: '"Oppenheimer" is trending #1 this week',
    itemId: 872585,
    mediaType: 'movie',
    image: 'https://image.tmdb.org/t/p/w92/8Gxv8gSFCU0XGDykEGv7zR1n2r3.jpg',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false,
  },
  {
    id: 3,
    type: 'recommendation',
    title: 'Based on Your Watch History',
    message: 'You might like "The Dark Knight"',
    itemId: 155,
    mediaType: 'movie',
    image: 'https://image.tmdb.org/t/p/w92/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    read: true,
  },
  {
    id: 4,
    type: 'new-release',
    title: 'New Episode Available',
    message: 'New episode of "The Mandalorian" just dropped',
    itemId: 82856,
    mediaType: 'tv',
    image: 'https://image.tmdb.org/t/p/w92/eU1i6eHXlzMOlEq0ku1Rzq7Y4wA.jpg',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true,
  },
];

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    setIsOpen(false);
    
    // Navigate to the item
    if (notification.mediaType === 'movie' || notification.mediaType === 'tv') {
      navigate(`/${notification.mediaType}/${notification.itemId}`);
    }
  };

  // Format timestamp
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 1000 / 60);
    const diffHours = Math.floor(diffMs / 1000 / 60 / 60);
    const diffDays = Math.floor(diffMs / 1000 / 60 / 60 / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Get icon for notification type
  const getTypeIcon = (type) => {
    switch (type) {
      case 'new-release':
        return <Film className="w-4 h-4 text-brand-red" />;
      case 'trending':
        return <TrendingUp className="w-4 h-4 text-yellow-500" />;
      case 'recommendation':
        return <Star className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white hover:opacity-85 relative transition"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-red rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 mt-3 w-96 max-h-[600px] bg-brand-darkGray border border-white/10 rounded-lg shadow-2xl z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="font-bold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-brand-red hover:text-red-400 transition"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[480px]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No notifications yet
                </div>
              ) : (
                notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full flex items-start gap-3 p-4 border-b border-white/5 hover:bg-white/5 transition text-left ${
                      !notification.read ? 'bg-white/5' : ''
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 w-12 h-16 rounded overflow-hidden">
                      <img
                        src={notification.image}
                        alt={notification.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getTypeIcon(notification.type)}
                        <span className="text-xs font-semibold text-gray-300">
                          {notification.title}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-gray-500">
                          {formatTimeAgo(notification.timestamp)}
                        </span>
                        {!notification.read && (
                          <span className="w-1.5 h-1.5 bg-brand-red rounded-full" />
                        )}
                      </div>
                    </div>

                    {/* Chevron */}
                    <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/10 text-center">
              <button
                onClick={() => {
                  setIsOpen(false);
                  // In production, navigate to full notifications page
                }}
                className="text-xs text-brand-red hover:text-red-400 transition"
              >
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationPanel;