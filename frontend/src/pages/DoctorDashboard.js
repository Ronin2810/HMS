import React, { useState, useEffect } from 'react';
import api from '../api/apiClient';
import MasterFile from '../components/MasterFile';
import PrescriptionForm from '../components/PrescriptionForm';

export default function DoctorDashboard() {
  const [patientId, setPatientId] = useState('');
  const [masterData, setMasterData] = useState(null);

  const handleSearch = async () => {
    const { data: patient } = await api.get(`/patients/${patientId}`);
    const { data: visits } = await api.get('/visits');
    const myVisits = visits.filter(v => v.patient_id === patientId);
    // get prescriptions
    let prescriptions = [];
    for (let v of myVisits) {
      const { data: p } = await api.get(`/visits/${v.visit_id}/prescriptions`);
      prescriptions.push(...p.map(x => ({ ...x, visit_date: v.created_at })));
    }
    setMasterData({ patient, visits: myVisits, prescriptions });
  };

  return (
    <div className="container">
      <h1>Doctor</h1>

      <div className="card">
        <input
          className="form-control"
          placeholder="Enter Patient ID"
          value={patientId}
          onChange={e => setPatientId(e.target.value)}
        />
        <button className="btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {masterData && (
        <div className="card">
          <MasterFile data={masterData} />
          {masterData.visits[0] && (
            <div className="card">
              <h2>New Prescription</h2>
              <PrescriptionForm
                visitId={masterData.visits[0].visit_id}
                patientId={patientId}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
