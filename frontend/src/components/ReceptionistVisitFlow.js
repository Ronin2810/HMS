// frontend/src/components/ReceptionistVisitFlow.jsx
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/apiClient';

const VISIT_TYPES = [
  { value: 'fresh', label: 'Fresh (new)' },
  { value: 'old', label: 'Old (returning)' },
  { value: 'follow_up', label: 'Follow-up' }
];

export default function ReceptionistVisitFlow() {
  const qc = useQueryClient();
  const [foundPatient, setFoundPatient] = useState(null);
  const [patientLookupLoading, setPatientLookupLoading] = useState(false);
  const { register, control, handleSubmit, watch, reset, setError, clearErrors, formState: { errors } } = useForm({
    defaultValues: { visit_type: 'fresh' }
  });

  // Today’s Visits list (display)
  const { data: visits = [], isLoading: loadingVisits } = useQuery(['visits'], () =>
    api.get('/visits').then(r => r.data)
  );

  const today = new Date().toDateString();
  const todayVisits = visits.filter(v => v.created_at && new Date(v.created_at).toDateString() === today);

  // Lookup patient by ID
  const lookupPatient = async (id) => {
    if (!id) return setFoundPatient(null);
    try {
      setPatientLookupLoading(true);
      const res = await api.get(`/patients/${id}`);
      setFoundPatient(res.data);
      clearErrors('patient_id');
    } catch {
      setFoundPatient(null);
      // Not found is OK; it will become new patient
    } finally {
      setPatientLookupLoading(false);
    }
  };

  // Handle “Check” button
  const onCheckPatient = async (e) => {
    e.preventDefault();
    const pid = watch('patient_id');
    await lookupPatient(pid);
  };

  // Save mutation: if patient exists → create visit; else create patient then visit
  const saveMut = useMutation({
    mutationFn: async (form) => {
      let patient_id = form.patient_id?.trim() || null;

      if (patient_id) {
        // Already validated? If not, ensure it exists:
        if (!foundPatient) {
          // revalidate
          await lookupPatient(patient_id);
          if (!foundPatient) {
            // they typed a non-existent ID, treat as new patient
            patient_id = null;
          }
        }
      }

      if (!patient_id) {
        // Create new patient (ID auto-generated in DB)
        const patientPayload = {
          first_name: form.first_name?.trim(),
          last_name: form.last_name?.trim(),
          date_of_birth: form.date_of_birth || null, // backend converts to Date
          gender: form.gender || null,
          contact_info: {
            phone: form.phone || null,
            email: form.email || null
          }
        };
        const p = await api.post('/patients', patientPayload).then(r => r.data);
        patient_id = p.patient_id;
      }

      const visitPayload = {
        patient_id,
        dept_id: form.dept_id ? Number(form.dept_id) : null,
        visit_type: form.visit_type || 'fresh',
        primary_doctor_id: form.primary_doctor_id ? Number(form.primary_doctor_id) : null
      };

      const v = await api.post('/visits', visitPayload).then(r => r.data);
      return v;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['visits'] });
      reset({ visit_type: 'fresh' });
      setFoundPatient(null);
    }
  });

  const onSubmit = (form) => {
    // basic validations for new patient flows
    if (!form.patient_id && (!form.first_name || !form.last_name)) {
      setError('first_name', { type: 'required', message: 'First name required for new patient' });
      setError('last_name',  { type: 'required', message: 'Last name required for new patient' });
      return;
    }
    saveMut.mutate(form);
  };

  return (
    <div className="container">
      <h1>Receptionist</h1>

      {/* Today’s Visits */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3>Today&apos;s Visits ({loadingVisits ? '…' : todayVisits.length})</h3>
        <ul className="list-group">
          {!loadingVisits && todayVisits.map(v => (
            <li className="list-group-item" key={v.visit_id}>
              {v.patient?.patient_id} — {v.patient?.first_name} {v.patient?.last_name} — {v.department?.name} — {v.visit_type}
            </li>
          ))}
        </ul>
      </div>

      {/* Create Visit */}
      <div className="card">
        <h2>Create Visit</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="form-grid">
          {/* Patient lookup by ID */}
          <div className="row">
            <input className="form-control" placeholder="Existing Patient ID (optional)" {...register('patient_id')} />
            <button className="btn-secondary" onClick={onCheckPatient} disabled={patientLookupLoading}>
              {patientLookupLoading ? 'Checking…' : 'Check'}
            </button>
          </div>
          {foundPatient
            ? <p style={{ color: 'green' }}>Patient found: {foundPatient.first_name} {foundPatient.last_name}</p>
            : watch('patient_id')
              ? <p style={{ color: '#b45309' }}>No patient found with that ID — will create as new.</p>
              : null}

          {/* New patient details (only needed when no existing ID) */}
          {!foundPatient && !watch('patient_id') && (
            <>
              <div className="row">
                <input className="form-control" placeholder="First name" {...register('first_name', { required: 'First name required' })} />
              </div>
              {errors.first_name && <p style={{ color: 'red' }}>{errors.first_name.message}</p>}

              <div className="row">
                <input className="form-control" placeholder="Last name" {...register('last_name', { required: 'Last name required' })} />
              </div>
              {errors.last_name && <p style={{ color: 'red' }}>{errors.last_name.message}</p>}

              <div className="row">
                <input type="date" className="form-control" {...register('date_of_birth')} />
                <select className="form-control" {...register('gender')}>
                  <option value="">Gender</option>
                  <option value="FEMALE">Female</option>
                  <option value="MALE">Male</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="row">
                <input className="form-control" placeholder="Phone" {...register('phone')} />
                <input className="form-control" placeholder="Email" {...register('email')} />
              </div>
            </>
          )}

          {/* Visit details */}
          <div className="row">
            <input type="number" className="form-control" placeholder="Department ID" {...register('dept_id')} />
            <select className="form-control" {...register('visit_type', { required: 'Visit type required' })}>
              {VISIT_TYPES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
            </select>
          </div>
          {errors.visit_type && <p style={{ color: 'red' }}>{errors.visit_type.message}</p>}

          <div className="row">
            <input type="number" className="form-control" placeholder="Primary Doctor ID" {...register('primary_doctor_id')} />
          </div>

          <button type="submit" className="btn-primary" disabled={saveMut.isLoading}>
            {saveMut.isLoading ? 'Saving…' : 'Save Visit'}
          </button>
        </form>
      </div>
    </div>
  );
}
