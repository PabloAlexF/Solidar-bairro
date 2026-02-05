import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, X, Clock, CheckCircle, AlertCircle, MessageCircle, Heart, Settings, Shield, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/apiService';
import { getSocket } from '../services/socketService';
import marca from '../assets/images/marca.png';

const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor((now - time) / (1000 * 60));

  if (diffInMinutes < 1) return 'Agora mesmo';
  if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h atrás`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d atrás`;

  return time.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};

const getNotificationIcon = (type) => {
  switch (type) {
    case 'chat': return <MessageCircle size={16} className="text-blue-500" />;
    case 'help': return <Heart size={16} className="text-red-500" />;
    case 'success': return <CheckCircle size={16} className="text-green-500" />;
    case 'warning': return <AlertCircle size={16} className="text-orange-500" />;
    default: return <Bell size={16} className="text-gray-500" />;
  }
};

const SharedHeader = ({ currentPage = '' }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Load notifications on component mount
