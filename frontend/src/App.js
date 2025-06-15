// frontend/src/App.js
import React, { useState } from 'react';
import Navbar                       from './components/Navbar';
import LoginPage                    from './pages/LoginPage';
import AdminDashboard               from './pages/AdminDashboard';
import ReceptionistDashboard        from './pages/ReceptionistDashboard';
import ReportGeneratorDashboard     from './pages/ReportGeneratorDashboard';
import DoctorDashboard              from './pages/DoctorDashboard';
import PharmacyDashboard            from './pages/PharmacyDashboard';

export default function App() {
  const [user, setUser] = useState(null);  // { staff_id, username, role, dept_id }
  const [view, setView] = useState(null);  // one of 'admin','receptionist','report-generator','doctor','pharmacy'

  const handleLogin = (userData) => {
    // Normalize backend role → frontend view key
    let viewRole = userData.role;
    if (viewRole === 'report_generator') viewRole = 'report-generator';
    if (viewRole === 'medical')         viewRole = 'pharmacy';
    if (viewRole === 'admin')           viewRole = 'admin';

    setUser({ ...userData, role: viewRole });
    setView(viewRole);
  };

  const handleLogout = () => {
    setUser(null);
    setView(null);
  };

  // If not logged in, show login form
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Once logged in, show only the user's dashboard
  return (
    <>
      <Navbar
        selected={view}
        onSelect={setView}
        onLogout={handleLogout}
        role={user.role}
      />
      <div style={{ padding: 20 }}>
        {view === 'admin'            && <AdminDashboard />}
        {view === 'receptionist'     && <ReceptionistDashboard />}
        {view === 'report-generator' && <ReportGeneratorDashboard />}
        {view === 'doctor'           && <DoctorDashboard />}
        {view === 'pharmacy'         && <PharmacyDashboard />}
      </div>
    </>
  );
}
