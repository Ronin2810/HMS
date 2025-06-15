// frontend/src/pages/LoginPage.js
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/apiClient';

export default function LoginPage({ onLogin }) {
  const [error, setError] = useState('');
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    api.get('/roles')
      .then(res => setRoles(res.data))
      .catch(() => setRoles([
        { name:'admin' },
        { name:'receptionist' },
        { name:'report_generator' },
        { name:'doctor' },
        { name:'medical' },
      ]));
  }, []);

  const { register, handleSubmit, formState:{ errors } } = useForm({
    defaultValues: { role:'receptionist', username:'', password:'' }
  });

  const onSubmit = async data => {
    try {
      setError('');
      const res = await api.post('/auth/login', data);
      onLogin(res.data);
    } catch (e) {
      setError(e.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Sign In</h2>
        {error && <div style={{ color:'red', marginBottom:'1rem' }}>{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <select
            className="form-control"
            {...register('role',{ required:'Role is required' })}
          >
            {roles.map(r => (
              <option key={r.name} value={r.name}>
                {r.name === 'report_generator'
                  ? 'Report Generator'
                  : r.name === 'medical'
                    ? 'Pharmacy'
                    : r.name.charAt(0).toUpperCase() + r.name.slice(1)}
              </option>
            ))}
          </select>
          {errors.role && <p style={{ color:'red' }}>{errors.role.message}</p>}

          <input
            className="form-control"
            placeholder="Username"
            {...register('username',{ required:'Username is required' })}
          />
          {errors.username && <p style={{ color:'red' }}>{errors.username.message}</p>}

          <input
            type="password"
            className="form-control"
            placeholder="Password"
            {...register('password',{ required:'Password is required' })}
          />
          {errors.password && <p style={{ color:'red' }}>{errors.password.message}</p>}

          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
