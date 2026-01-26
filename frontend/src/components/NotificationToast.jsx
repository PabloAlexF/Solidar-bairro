import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const getToastIcon = (type) => {
  switch (type) {
    case 'success': return <CheckCircle size={20} />;
    case 'error': return <AlertCircle size={20} />;
    case 'warning': return <AlertTriangle size={20} />;
    case 'info': return <Info size={20} />;
    default: return <Info size={20} />;
  }
};

const getToastColors = (type) => {
  switch (type) {
    case 'success': 
      return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: 'text-green-600',
        title: 'text-green-900',
        message: 'text-green-700'
      };
    case 'error':
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'text-red-600',
        title: 'text-red-900',
        message: 'text-red-700'
      };
    case 'warning':
      return {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        icon: 'text-orange-600',
        title: 'text-orange-900',
        message: 'text-orange-700'
      };
    case 'info':
    default:
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-600',
        title: 'text-blue-900',
        message: 'text-blue-700'
      };
  }
};

export const NotificationToast = ({ 
  id,
  type = 'info', 
  title, 
  message, 
  duration = 5000,
  onClose,
  position = 'top-right'
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  
  const colors = getToastColors(type);

  useEffect(() => {
    if (duration > 0) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (duration / 100));
          if (newProgress <= 0) {
            handleClose();
            return 0;
          }
          return newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.(id);
    }, 300);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left': return 'top-4 left-4';
      case 'top-center': return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'top-right': return 'top-4 right-4';
      case 'bottom-left': return 'bottom-4 left-4';
      case 'bottom-center': return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right': return 'bottom-4 right-4';
      default: return 'top-4 right-4';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed ${getPositionClasses()} z-50 max-w-sm w-full`}
        >
          <div className={`${colors.bg} ${colors.border} border rounded-lg shadow-lg overflow-hidden`}>
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className={`${colors.icon} flex-shrink-0 mt-0.5`}>
                  {getToastIcon(type)}
                </div>
                <div className="flex-1 min-w-0">
                  {title && (
                    <h4 className={`${colors.title} font-semibold text-sm mb-1`}>
                      {title}
                    </h4>
                  )}
                  {message && (
                    <p className={`${colors.message} text-sm leading-relaxed`}>
                      {message}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleClose}
                  className={`${colors.icon} hover:opacity-70 transition-opacity flex-shrink-0 p-1 rounded`}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            {duration > 0 && (
              <div className="h-1 bg-black bg-opacity-10">
                <motion.div
                  className={`h-full ${type === 'success' ? 'bg-green-500' : 
                    type === 'error' ? 'bg-red-500' : 
                    type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'}`}
                  initial={{ width: '100%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook para gerenciar toasts
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    const newToast = { id, ...toast };
    setToasts(prev => [...prev, newToast]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  const success = (title, message, options = {}) => 
    addToast({ type: 'success', title, message, ...options });

  const error = (title, message, options = {}) => 
    addToast({ type: 'error', title, message, ...options });

  const warning = (title, message, options = {}) => 
    addToast({ type: 'warning', title, message, ...options });

  const info = (title, message, options = {}) => 
    addToast({ type: 'info', title, message, ...options });

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info
  };
};

// Container para renderizar todos os toasts
export const ToastContainer = ({ position = 'top-right' }) => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <NotificationToast
          key={toast.id}
          {...toast}
          position={position}
          onClose={removeToast}
        />
      ))}
    </div>
  );
};