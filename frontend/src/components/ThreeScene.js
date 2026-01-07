import React from 'react';
import { Package, Search, CheckCircle2, MapPin } from 'lucide-react';
import './ThreeScene.css';

export default function ThreeScene() {
  return (
    <div className="three-scene-container">
      <div className="floating-objects">
        <div className="floating-item item-1">
          <Package size={32} />
        </div>
        <div className="floating-item item-2">
          <Search size={28} />
        </div>
        <div className="floating-item item-3">
          <CheckCircle2 size={30} />
        </div>
        <div className="floating-item item-4">
          <MapPin size={26} />
        </div>
        <div className="floating-item item-5">
          <Package size={24} />
        </div>
        <div className="floating-item item-6">
          <Search size={22} />
        </div>
      </div>
      
      <div className="center-orb">
        <div className="orb-inner">
          <div className="orb-core"></div>
        </div>
      </div>
      
      <div className="connection-lines">
        <div className="line line-1"></div>
        <div className="line line-2"></div>
        <div className="line line-3"></div>
        <div className="line line-4"></div>
      </div>
    </div>
  );
}