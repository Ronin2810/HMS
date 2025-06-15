import React from 'react';
import PharmacyList from '../components/PharmacyList';

export default function PharmacyDashboard() {
  return (
    <div className="container">
      <h1>Pharmacy</h1>
      <div className="card">
        <PharmacyList />
      </div>
    </div>
  );
}
