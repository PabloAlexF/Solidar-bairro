import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/components/Toast.css';

const Toast = ({ show, message, type = 'info', onClose, duration = 4000, title }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (show && duration > 0) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (duration / 100));
          if (newProgress <= 0) {
            clearInterval(interval);
            onClose();
            return 0;
          }
          return newProgress;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [show, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'warning':
        return <AlertCircle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          className={`toast toast-${type}`}
          initial={{ opacity: 0, x: 400, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 400, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.4
          }}
        >
          <div className="toast-content">
            <div className="toast-icon">
              {getIcon()}
            </div>
            <div className="toast-text">
              {title && <div className="toast-title">{title}</div>}
              <div className="toast-message">{message}</div>
            </div>
            <button 
              className="toast-close" 
              onClick={onClose}
              aria-label="Fechar notificação"
            >
              <X size={16} />
            </button>
          </div>
          {duration > 0 && (
            <div className="toast-progress">
              <motion.div 
                className="toast-progress-bar"
                initial={{ width: "100%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;