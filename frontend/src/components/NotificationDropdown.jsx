import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

export const NotificationDropdown = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [localNotifications, setLocalNotifications] = useState([]);
  const [showModalNotification, setShowModalNotification] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const { notifications, clearNotifications, addNotification } = useNotifications();

  useEffect(() => {
    // Auto-show notification after component mounts
    const timer = setTimeout(() => {
      if (!localNotifications.some(n => n.id === 'welcome-notification')) {
        setLocalNotifications([{
          id: 'welcome-notification',
          title: 'Bem-vindo ao SolidarBairro!',
          message: 'Explore nossa plataforma e conecte-se com sua comunidade.',
          timestamp: new Date()
        }]);
        setShowNotifications(true);

        // Auto-hide after 5 seconds
        setTimeout(() => {
          setIsClosing(true);
          setTimeout(() => {
            setShowNotifications(false);
            setIsClosing(false);
            setLocalNotifications([]);
          }, 300);
        }, 5000);
      }
    }, 1000); // Delay to ensure component is mounted

    // Listen for explore platform button click
    const handleExploreClick = () => {
      if (!showModalNotification) {
        setShowModalNotification(true);

        // Auto-hide after 5 seconds
        setTimeout(() => {
          setIsModalClosing(true);
          setTimeout(() => {
            setShowModalNotification(false);
            setIsModalClosing(false);
          }, 300);
        }, 5000);
      }
    };

    window.addEventListener('explorePlatformClick', handleExploreClick);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('explorePlatformClick', handleExploreClick);
    };
  }, [localNotifications]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowNotifications(false);
      setIsClosing(false);
    }, 300);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        style={{ background: 'none', border: 'none', color: 'inherit', position: 'relative', top: '8px' }}
      >
        <Bell size={24} />
        {notifications.length > 0 && (
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '8px',
            height: '8px',
            background: '#ef4444',
            borderRadius: '50%'
          }} />
        )}
      </button>
      {(showNotifications || isClosing) && (
        <div className={`notification-dropdown ${isClosing ? 'closing' : ''}`} style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          width: '320px',
          maxHeight: '400px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          marginTop: '8px',
          padding: '16px',
          overflow: 'hidden'
        }}>
          <div className="notification-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 className="notification-title" style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>Notificações</h4>
            {(notifications.length > 0 || localNotifications.length > 0) && (
              <button
                className="notification-clear"
                onClick={() => {
                  clearNotifications();
                  setLocalNotifications([]);
                }}
                style={{ background: 'none', border: 'none', fontSize: '12px', color: '#6b7280', cursor: 'pointer', padding: '4px 8px', borderRadius: '8px', transition: 'background 0.2s ease' }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.05)'}
                onMouseLeave={(e) => e.target.style.background = 'none'}
              >
                Limpar
              </button>
            )}
          </div>
          {(notifications.length === 0 && localNotifications.length === 0) ? (
            <div className="notification-empty" style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', padding: '20px', margin: 0 }}>
              Nenhuma notificação no momento
            </div>
          ) : (
            <div className="notification-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {[...localNotifications, ...notifications].map(notification => (
                <div key={notification.id} className="notification-item" style={{
                  padding: '12px 0',
                  borderBottom: '1px solid #f3f4f6',
                  fontSize: '13px'
                }}>
                  <div className="notification-item-title" style={{ fontWeight: '600', marginBottom: '4px', color: '#0f172a' }}>{notification.title}</div>
                  <div className="notification-item-message" style={{ color: '#6b7280', marginBottom: '4px' }}>{notification.message}</div>
                  <div className="notification-item-time" style={{ color: '#9ca3af', fontSize: '11px' }}>
                    {notification.timestamp.toLocaleTimeString ? notification.timestamp.toLocaleTimeString() : new Date(notification.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {(showModalNotification || isModalClosing) && (
        <div className={`modal-notification ${isModalClosing ? 'closing' : ''}`} style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          padding: '16px 24px',
          zIndex: 10000,
          animation: 'slideDown 0.5s ease-out',
          maxWidth: '400px',
          width: '90%',
          textAlign: 'center'
        }}>
          <div className="modal-notification-title" style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
            Escolha como contribuir!
          </div>
          <div className="modal-notification-message" style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.4' }}>
            Selecione uma das opções abaixo para começar sua jornada de solidariedade.
          </div>
        </div>
      )}
    </div>
  );
};
