import React from 'react';

export default function AdminSimple() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Admin Dashboard</h1>
      <p>Página administrativa funcionando!</p>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginTop: '2rem' }}>
        <div style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
          <h3>ONGs</h3>
          <p>5 cadastradas</p>
        </div>
        <div style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
          <h3>Comércios</h3>
          <p>12 parceiros</p>
        </div>
        <div style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
          <h3>Famílias</h3>
          <p>8 cadastradas</p>
        </div>
      </div>
    </div>
  );
}