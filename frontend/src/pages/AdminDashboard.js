import React from 'react';
import StaffList from '../components/StaffList';
import StaffForm from '../components/StaffForm';

export default function AdminDashboard() {
  return (
    <div className="container">
      <h1>Admin</h1>

      <div className="card">
        <h2>Staff Members</h2>
        <StaffList />
      </div>

      <div className="card">
        <h2>New Staff</h2>
        <StaffForm />
      </div>
    </div>
  );
}
