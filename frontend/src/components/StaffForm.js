import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/apiClient';

export default function StaffForm() {
  const qc = useQueryClient();
  const { data: roles = [] } = useQuery(['roles'], () => api.get('/roles').then(r => r.data));
  const { data: depts = [] } = useQuery(['depts'], () => api.get('/departments').then(r => r.data));

  const { control, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: JSON.parse(localStorage.getItem('staffDraft') || '{}')
  });

  useEffect(() => {
    const sub = watch(val => localStorage.setItem('staffDraft', JSON.stringify(val)));
    return () => sub.unsubscribe();
  }, [watch]);

  const m = useMutation(data => api.post('/staff', data), {
    onSuccess: () => {
      qc.invalidateQueries(['staff']);
      localStorage.removeItem('staffDraft');
      reset();
    }
  });

  return (
    <form onSubmit={handleSubmit(m.mutate)} className="card">
      <Controller name="username" control={control}
        rules={{ required: 'Required' }}
        render={({ field }) => (
          <input
            className="form-control"
            placeholder="Username"
            {...field}
          />
        )}
      />
      {errors.username && <p style={{ color:'red' }}>{errors.username.message}</p>}

      <Controller name="password" control={control}
        rules={{ required: 'Required' }}
        render={({ field }) => (
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            {...field}
          />
        )}
      />
      {errors.password && <p style={{ color:'red' }}>{errors.password.message}</p>}

      <Controller name="role_id" control={control}
        rules={{ required: 'Required' }}
        render={({ field }) => (
          <select className="form-control" {...field}>
            <option value="">Select role…</option>
            {roles.map(r => (
              <option key={r.role_id} value={r.role_id}>{r.name}</option>
            ))}
          </select>
        )}
      />
      {errors.role_id && <p style={{ color:'red' }}>Role is required</p>}

      <Controller name="dept_id" control={control}
        render={({ field }) => (
          <select className="form-control" {...field}>
            <option value="">Select dept…</option>
            {depts.map(d => (
              <option key={d.dept_id} value={d.dept_id}>{d.name}</option>
            ))}
          </select>
        )}
      />

      <button type="submit" className="btn-primary" disabled={m.isLoading}>
        {m.isLoading ? 'Adding…' : 'Add Staff'}
      </button>
    </form>
  );
}
