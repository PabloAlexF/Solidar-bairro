import React from 'react';

const FlatIcon = ({ type, size = 24, color = 'currentColor' }) => {
  const icons = {
    chevronLeft: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M15 18L9 12L15 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    arrowRight: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M9 18L15 12L9 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    utensils: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.20-1.10-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
      </svg>
    ),
    shirt: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M16 4h1.5c.83 0 1.5.67 1.5 1.5S18.33 7 17.5 7H17v10c0 .55-.45 1-1 1H8c-.55 0-1-.45-1-1V7h-.5C5.67 7 5 6.33 5 5.5S5.67 4 6.5 4H8c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2z"/>
      </svg>
    ),
    droplets: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2C20 10.48 17.33 6.55 12 2z"/>
      </svg>
    ),
    pill: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M10.5 13.5L8.5 15.5C7.12 16.88 4.88 16.88 3.5 15.5C2.12 14.12 2.12 11.88 3.5 10.5L10.5 3.5C11.88 2.12 14.12 2.12 15.5 3.5L20.5 8.5C21.88 9.88 21.88 12.12 20.5 13.5C19.12 14.88 16.88 14.88 15.5 13.5L13.5 11.5"/>
      </svg>
    ),
    handCoins: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M11 17h2v-1h1c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1h-3v-1h4V8h-2V7h-2v1h-1c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h3v1H9v2h2v1zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
      </svg>
    ),
    briefcase: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M10 16V15H8V16C8 17.1 8.9 18 10 18H14C15.1 18 16 17.1 16 16V15H14V16H10ZM20 7H16V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7H4C2.9 7 2 7.9 2 9V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7ZM10 5H14V7H10V5Z"/>
      </svg>
    ),
    plus: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 5V19M5 12H19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    check: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M20 6L9 17L4 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    smartphone: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M17 2H7C5.9 2 5 2.9 5 4V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V4C19 2.9 18.1 2 17 2ZM17 18H7V6H17V18Z"/>
      </svg>
    ),
    phone: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"/>
      </svg>
    ),
    messageSquare: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"/>
      </svg>
    ),
    alertCircle: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"/>
      </svg>
    ),
    clock: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2ZM17 13H11V7H13V11H17V13Z"/>
      </svg>
    ),
    mapPin: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5Z"/>
      </svg>
    ),
    building2: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M12 7V3H2V21H22V7H12ZM6 19H4V17H6V19ZM6 15H4V13H6V15ZM6 11H4V9H6V11ZM6 7H4V5H6V7ZM10 19H8V17H10V19ZM10 15H8V13H10V15ZM10 11H8V9H10V11ZM10 7H8V5H10V7ZM20 19H12V17H14V15H12V13H14V11H12V9H20V19ZM18 11H16V13H18V11ZM18 15H16V17H18V15Z"/>
      </svg>
    ),
    users: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M16 4C18.2 4 20 5.8 20 8S18.2 12 16 12 12 10.2 12 8 13.8 4 16 4ZM8 4C10.2 4 12 5.8 12 8S10.2 12 8 12 4 10.2 4 8 5.8 4 8 4ZM8 14C5.8 14 1 15.1 1 17.3V20H15V17.3C15 15.1 10.2 14 8 14ZM16 14C15.7 14 15.4 14 15.1 14.1C16.2 14.8 17 15.9 17 17.3V20H23V17.3C23 15.1 18.2 14 16 14Z"/>
      </svg>
    ),
    shieldCheck: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
      </svg>
    ),
    userCircle: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM12 6C13.93 6 15.5 7.57 15.5 9.5S13.93 13 12 13 8.5 11.43 8.5 9.5 10.07 6 12 6ZM12 20C9.97 20 8.18 19.17 6.85 17.85C6.85 16.33 9.77 15.5 12 15.5S17.15 16.33 17.15 17.85C15.82 19.17 14.03 20 12 20Z"/>
      </svg>
    ),
    zap: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z"/>
      </svg>
    ),
    footprints: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M18.5 16C17.1 16 16 17.1 16 18.5S17.1 21 18.5 21 21 19.9 21 18.5 19.9 16 18.5 16ZM5.5 9C4.1 9 3 10.1 3 11.5S4.1 14 5.5 14 8 12.9 8 11.5 6.9 9 5.5 9ZM18.5 12C19.9 12 21 10.9 21 9.5S19.9 7 18.5 7 16 8.1 16 9.5 17.1 12 18.5 12ZM5.5 5C6.9 5 8 3.9 8 2.5S6.9 0 5.5 0 3 1.1 3 2.5 4.1 5 5.5 5Z"/>
      </svg>
    ),
    armchair: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M7 13C6.45 13 6 12.55 6 12V9C6 7.9 6.9 7 8 7H16C17.1 7 18 7.9 18 9V12C18 12.55 17.55 13 17 13H16V19H14V13H10V19H8V13H7ZM4 10V12C4 13.1 4.9 14 6 14V19H4V21H20V19H18V14C19.1 14 20 13.1 20 12V10C20 8.9 19.1 8 18 8V9C18 6.79 16.21 5 14 5H10C7.79 5 6 6.79 6 9V8C4.9 8 4 8.9 4 10Z"/>
      </svg>
    ),
    tv: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M21 3H3C1.9 3 1 3.9 1 5V17C1 18.1 1.9 19 3 19H8V21H16V19H21C22.1 19 23 18.1 23 17V5C23 3.9 22.1 3 21 3ZM21 17H3V5H21V17Z"/>
      </svg>
    ),
    bookOpen: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M21 5C19.89 4.65 18.67 4.5 17.5 4.5C15.55 4.5 13.45 4.9 12 6C10.55 4.9 8.45 4.5 6.5 4.5C5.33 4.5 4.11 4.65 3 5C2.25 5.25 1.6 5.55 1 6V18.5C1 18.78 1.22 19 1.5 19C1.6 19 1.65 18.95 1.75 18.95C2.95 18.45 4.05 18.2 5.5 18.2C7.45 18.2 9.55 18.65 11 19.95C12.45 18.65 14.55 18.2 16.5 18.2C17.95 18.2 19.05 18.45 20.25 18.95C20.35 18.95 20.4 19 20.5 19C20.78 19 21 18.78 21 18.5V6C20.4 5.55 19.75 5.25 21 5ZM21 16.5C19.9 16.15 18.7 16 17.5 16C15.8 16 14.15 16.4 12.75 17.1V8.5C14.1 7.65 15.7 7.2 17.5 7.2C18.7 7.2 19.9 7.35 21 7.7V16.5Z"/>
      </svg>
    ),
    bus: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M4 16C4 17.11 4.89 18 6 18C7.11 18 8 17.11 8 16H16C16 17.11 16.89 18 18 18C19.11 18 20 17.11 20 16H21V12C21 8.5 19.5 7 16 7H8C4.5 7 3 8.5 3 12V16H4ZM6.5 13.5C6.5 12.67 7.17 12 8 12S9.5 12.67 9.5 13.5 8.83 15 8 15 6.5 14.33 6.5 13.5ZM14.5 13.5C14.5 12.67 15.17 12 16 12S17.5 12.67 17.5 13.5 16.83 15 16 15 14.5 14.33 14.5 13.5ZM18 10H6V8H18V10Z"/>
      </svg>
    ),
    x: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  };

  return icons[type] || icons.plus;
};

export default FlatIcon;