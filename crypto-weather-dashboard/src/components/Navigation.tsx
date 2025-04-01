'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { markAllAsRead } from '../store/slices/notificationsSlice';
import { useEffect, useState } from 'react';
import { initializeWebSocket, simulateWeatherAlerts } from '../services/websocketService';

const Navigation = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { items, unreadCount } = useSelector((state: RootState) => state.notifications);
  const [showNotifications, setShowNotifications] = useState(false);

 
  useEffect(() => {
    const cleanup = initializeWebSocket();
    simulateWeatherAlerts();
    
    return cleanup;
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showNotifications) {
      dispatch(markAllAsRead());
    }
  };

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">Crypto Weather</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Dashboard
              </Link>
              <div className="relative">
                <button
                  onClick={toggleNotifications}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 flex items-center"
                >
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
                    <div className="py-2 px-4 bg-gray-100 border-b flex justify-between items-center">
                      <span className="font-medium text-gray-800">Notifications</span>
                      <button
                        onClick={() => dispatch(markAllAsRead())}
                        className="text-xs text-blue-500 hover:text-blue-700"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {items.length === 0 ? (
                        <div className="py-4 px-4 text-gray-500 text-center">
                          No notifications
                        </div>
                      ) : (
                        items.map((item) => (
                          <div
                            key={item.id}
                            className={`py-3 px-4 border-b hover:bg-gray-50 ${
                              !item.read ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex items-start">
                              <div className={`h-2 w-2 mt-1 rounded-full mr-2 ${
                                item.type === 'price_alert' ? 'bg-green-500' : 'bg-yellow-500'
                              }`}></div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">{item.title}</p>
                                <p className="text-xs text-gray-500">{item.message}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(item.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
        
          <div className="md:hidden">
            <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-2 py-1 rounded-md">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;