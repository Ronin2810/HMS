import React from 'react';

export default function MasterFile({ data }) {
  const { patient, visits, prescriptions } = data;
  return (
    <div>
      <h2>{patient.first_name} {patient.last_name}</h2>
      <p><strong>DOB:</strong> {new Date(patient.date_of_birth).toLocaleDateString()}</p>
      <p><strong>Gender:</strong> {patient.gender}</p>

      <h3>Visits</h3>
      <ul className="list-group">
        {visits.map(v => (
          <li className="list-group-item" key={v.visit_id}>
            {v.visit_type} on {new Date(v.created_at).toLocaleDateString()}
          </li>
        ))}
      </ul>

      <h3>Prescriptions</h3>
      <ul className="list-group">
        {prescriptions.map(p => (
          <li className="list-group-item" key={p.prescription_id}>
            Visit {p.visit_id}: {p.medicines.map(m=>`${m.name}(${m.qty})`).join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
}
