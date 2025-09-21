// frontend/src/components/VisitForm.js
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/apiClient';

export default function VisitForm() {
  const qc = useQueryClient();

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: JSON.parse(localStorage.getItem('visitDraft') || '{}')
  });

  // persist draft locally while typing
  useEffect(() => {
    const sub = watch((val) => localStorage.setItem('visitDraft', JSON.stringify(val)));
    return () => sub.unsubscribe();
  }, [watch]);

  const mut = useMutation({
    // form contains both patient fields and visit fields
    mutationFn: async (form) => {
      // 1) Create (or upsert) the patient first
      const patientPayload = {
        first_name: form.first_name?.trim(),
        last_name: form.last_name?.trim(),
        date_of_birth: form.date_of_birth || null,
        gender: form.gender || null,
        phone: form.phone || null,
        email: form.email || null,
        // add other patient fields you expose on the form as needed
      };

      const patientRes = await api.post('/patients', patientPayload);
      const patient = patientRes.data;

      // 2) Create visit linked to that patient
      const visitPayload = {
        patient_id: patient.patient_id,
        dept_id: form.dept_id ? Number(form.dept_id) : null,
        visit_type: form.visit_type || 'OPD',
        primary_doctor_id: form.primary_doctor_id ? Number(form.primary_doctor_id) : null,
        // You can pass created_at or let DB default now()
      };

      const visitRes = await api.post('/visits', visitPayload);
      return visitRes.data;
    },
    onSuccess: (createdVisit) => {
      // refresh the list
      qc.invalidateQueries({ queryKey: ['visits'] });
      // clear draft + form
      localStorage.removeItem('visitDraft');
      reset({});
      // (Optional) open a print page if/when you implement it on the backend:
      // window.open(`/visits/${createdVisit.visit_id}/case-paper`, '_blank');
    }
  });

  const onSubmit = (form) => mut.mutate(form);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-grid">
      {/* --- Patient section --- */}
      <input
        className="form-control"
        placeholder="First name"
        {...register('first_name', { required: 'First name is required' })}
      />
      {errors.first_name && <p style={{ color: 'red' }}>{errors.first_name.message}</p>}

      <input
        className="form-control"
        placeholder="Last name"
        {...register('last_name', { required: 'Last name is required' })}
      />
      {errors.last_name && <p style={{ color: 'red' }}>{errors.last_name.message}</p>}

      <Controller
        name="date_of_birth"
        control={control}
        render={({ field }) => <input type="date" className="form-control" {...field} />}
      />

      <Controller
        name="gender"
        control={control}
        render={({ field }) => (
          <select className="form-control" {...field}>
            <option value="">Gender</option>
            <option value="FEMALE">Female</option>
            <option value="MALE">Male</option>
            <option value="OTHER">Other</option>
          </select>
        )}
      />

      <input className="form-control" placeholder="Phone" {...register('phone')} />
      <input className="form-control" placeholder="Email" {...register('email')} />

      {/* --- Visit section --- */}
      <Controller
        name="dept_id"
        control={control}
        render={({ field }) => (
          <input type="number" className="form-control" placeholder="Department ID" {...field} />
        )}
      />

      <Controller
        name="visit_type"
        control={control}
        rules={{ required: 'Visit type is required' }}
        render={({ field }) => (
          <select className="form-control" {...field}>
            <option value="">Visit type</option>
            <option value="OPD">OPD</option>
            <option value="IPD">IPD</option>
            <option value="EMERGENCY">Emergency</option>
          </select>
        )}
      />
      {errors.visit_type && <p style={{ color: 'red' }}>{errors.visit_type.message}</p>}

      <Controller
        name="primary_doctor_id"
        control={control}
        render={({ field }) => (
          <input type="number" className="form-control" placeholder="Primary Doctor ID" {...field} />
        )}
      />

      <button type="submit" className="btn-primary" disabled={mut.isLoading}>
        {mut.isLoading ? 'Saving…' : 'Save Visit'}
      </button>
    </form>
  );
}
