import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/apiClient';

export default function StaffList() {
  const qc = useQueryClient();
  const { data: staff = [], isLoading } = useQuery(
    ['staff'],
    () => api.get('/staff').then(r => r.data)
  );

  const del = useMutation(id => api.delete(`/staff/${id}`), {
    onSuccess: () => qc.invalidateQueries(['staff'])
  });

  if (isLoading) return <p>Loading staff…</p>;

  return (
    <ul className="list-group">
      {staff.map(s => (
        <li className="list-group-item" key={s.staff_id}>
          {s.username} — {s.role.name} — {s.department?.name || 'None'}
          <button
            className="btn-secondary"
            style={{ float: 'right' }}
            onClick={() => del.mutate(s.staff_id)}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
