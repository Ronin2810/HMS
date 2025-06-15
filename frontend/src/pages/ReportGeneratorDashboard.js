import React from 'react';
import ReportsList from '../components/ReportsList';
import ReportForm  from '../components/ReportForm';

export default function ReportGeneratorDashboard() {
  return (
    <div className="container">
      <h1>Report Generator</h1>

      <div className="card">
        <h2>Today's Reports</h2>
        <ReportsList />
      </div>

      <div className="card">
        <h2>New Report</h2>
        <ReportForm />
      </div>
    </div>
  );
}
