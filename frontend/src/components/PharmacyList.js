import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/apiClient';
import DispenseForm from './DispenseForm';

export default function PharmacyList() {
  const visitsQ = useQuery(['visits'], () => api.get('/visits').then(r=>r.data));
  const today = new Date().toDateString();
  const todayVisits = (visitsQ.data || []).filter(v => new Date(v.created_at).toDateString() === today);

  const prescQ = useQuery(
    ['todayPresc', todayVisits.map(v=>v.visit_id)],
    async () => {
      let list = [];
      for (let v of todayVisits) {
        const { data } = await api.get(`/visits/${v.visit_id}/prescriptions`);
        list.push(...data.map(p => ({ ...p, visit_id: v.visit_id })));
      }
      return list;
    },
    { enabled: visitsQ.isSuccess }
  );

  if (visitsQ.isLoading || prescQ.isLoading) return <p>Loading…</p>;

  return (
    <ul className="list-group">
      {prescQ.data.map(p => (
        <li className="list-group-item" key={p.prescription_id}>
          <div>
            Visit {p.visit_id}: {p.medicines.map(m=>`${m.name}(${m.qty})`).join(', ')}
          </div>
          <DispenseForm prescription={p} />
        </li>
      ))}
    </ul>
  );
}
