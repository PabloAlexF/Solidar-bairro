import React from 'react';
import Header from '../components/Header';
import QuickActions from '../components/QuickActions';
import NearbyHelps from '../components/NearbyHelps';
import UserImpact from '../components/UserImpact';
import BottomNav from '../components/BottomNav';

const Home = () => {
  return (
    <div className="app-container">
      <Header />
      <main>
        <QuickActions />
        <NearbyHelps />
        <UserImpact />
      </main>
      <BottomNav />
    </div>
  );
};

export default Home;