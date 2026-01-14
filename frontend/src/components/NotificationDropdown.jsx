import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

export const NotificationDropdown = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, clearNotifications } = useNotifications();

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
      {showNotifications && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          width: '280px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          zIndex: 1000,
          marginTop: '8px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>Notificações</h4>
            {notifications.length > 0 && (
              <button 
                onClick={clearNotifications}
                style={{ background: 'none', border: 'none', fontSize: '12px', color: '#6b7280' }}
              >
                Limpar
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <div style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', padding: '20px' }}>
              Nenhuma notificação no momento
            </div>
          ) : (
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {notifications.map(notification => (
                <div key={notification.id} style={{
                  padding: '8px 0',
                  borderBottom: '1px solid #f3f4f6',
                  fontSize: '13px'
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>{notification.title}</div>
                  <div style={{ color: '#6b7280' }}>{notification.message}</div>
                  <div style={{ color: '#9ca3af', fontSize: '11px', marginTop: '4px' }}>
                    {notification.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};