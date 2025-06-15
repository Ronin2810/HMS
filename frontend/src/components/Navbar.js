// frontend/src/components/Navbar.js
import React from 'react';

export default function Navbar({ selected, onSelect, onLogout, role }) {
  const labelMap = {
    admin: 'Admin',
    receptionist: 'Receptionist',
    'report-generator': 'Report Generator',
    doctor: 'Doctor',
    pharmacy: 'Pharmacy'
  };

  return (
    <div className="navbar">
      <div className="brand">Hospital Management</div>
      <button
        className={`nav-btn ${selected === role ? 'active' : ''}`}
        onClick={() => onSelect(role)}
      >
        {labelMap[role]}
      </button>
      <button className="logout" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}
