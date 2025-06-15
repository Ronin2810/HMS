// frontend/src/pages/ReceptionistDashboard.js
import React from 'react';
import VisitsList from '../components/VisitsList';
import VisitForm  from '../components/VisitForm';

export default function ReceptionistDashboard() {
  return (
    <div className="container">
      <h1>Receptionist</h1>

      <div className="card">
        <VisitsList />
      </div>

      <div className="card">
        <h2>New Visit</h2>
        <VisitForm />
      </div>
    </div>
  );
}
