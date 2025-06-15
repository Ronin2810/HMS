import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/apiClient';

export default function ReportsList({ patientId }) {
  const { data: reps = [], isLoading } = useQuery(['reports'], () =>
    api.get('/reports').then(r => r.data)
  );
  if (isLoading) return <p>Loading…</p>;

  const today = new Date().toDateString();
  const list = reps.filter(r =>
    patientId
      ? r.patient.patient_id === patientId
      : new Date(r.created_at).toDateString() === today
  );

  return (
    <ul className="list-group">
      {list.map(r => (
        <li className="list-group-item" key={r.report_id}>
          {r.patient.first_name} {r.patient.last_name} — {r.department?.name} —{' '}
          <a href={r.file_url} target="_blank" rel="noopener noreferrer">
            {r.file_type.toUpperCase()}
          </a>
        </li>
      ))}
    </ul>
  );
}
