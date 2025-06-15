// frontend/src/components/VisitsList.js
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/apiClient';

export default function VisitsList() {
  const { data: visits = [], isLoading } = useQuery(['visits'], () =>
    api.get('/visits').then(r=>r.data)
  );
  if (isLoading) return <p>Loading…</p>;

  const today = new Date().toDateString();
  const todayVisits = visits.filter(v =>
    new Date(v.created_at).toDateString() === today
  );

  return (
    <>
      <h3>Today's Visits ({todayVisits.length})</h3>
      <ul className="list-group">
        {todayVisits.map(v => (
          <li className="list-group-item" key={v.visit_id}>
            {v.patient.first_name} {v.patient.last_name} — {v.department.name} — {v.visit_type}
          </li>
        ))}
      </ul>
    </>
  );
}
