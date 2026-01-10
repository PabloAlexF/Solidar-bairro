import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MobileLandingPage } from '../components/MobileLandingPage';

// Simple test component to verify mobile landing page
export const TestMobileLanding = () => {
  return (
    <BrowserRouter>
      <MobileLandingPage />
    </BrowserRouter>
  );
};

export default TestMobileLanding;