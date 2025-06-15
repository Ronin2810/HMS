// frontend/src/components/VisitForm.js
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/apiClient';

export default function VisitForm() {
  const qc = useQueryClient();
  const { control, handleSubmit, watch, formState:{ errors } } = useForm({
    defaultValues: JSON.parse(localStorage.getItem('visitDraft')||'{}')
  });

  useEffect(() => {
    const sub = watch(val => localStorage.setItem('visitDraft', JSON.stringify(val)));
    return () => sub.unsubscribe();
  }, [watch]);

  const mut = useMutation(data =>
    api.post('/visits', {
      ...data,
      date_of_birth: data.date_of_birth ? data.date_of_birth + 'T00:00:00.000Z' : undefined
    }),
    {
      onSuccess: () => {
        qc.invalidateQueries(['visits']);
        localStorage.removeItem('visitDraft');
        setTimeout(() => window.print(), 100);
      }
    }
  );

  return (
    <form onSubmit={handleSubmit(mut.mutate)}>
      <Controller name="patient_id" control={control}
        render={({ field }) => (
          <input className="form-control" placeholder="Patient ID (leave blank to create new)" {...field} />
        )}
      />

      {!watch('patient_id') && (
        <>
          <Controller name="first_name" control={control}
            rules={{ required:'Required' }}
            render={({ field }) => (
              <input className="form-control" placeholder="First Name*" {...field} />
            )}
          />
          {errors.first_name && <p style={{ color:'red' }}>{errors.first_name.message}</p>}

          <Controller name="last_name" control={control}
            rules={{ required:'Required' }}
            render={({ field }) => (
              <input className="form-control" placeholder="Last Name*" {...field} />
            )}
          />
          {errors.last_name && <p style={{ color:'red' }}>{errors.last_name.message}</p>}
        </>
      )}

      <Controller name="date_of_birth" control={control}
        render={({ field }) => (
          <input type="date" className="form-control" {...field} />
        )}
      />

      <Controller name="gender" control={control}
        render={({ field }) => (
          <select className="form-control" {...field}>
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        )}
      />

      <Controller name="dept_id" control={control}
        rules={{ required:'Required', min:{ value:1,message:'Must be ≥1' } }}
        render={({ field }) => (
          <input type="number" className="form-control" placeholder="Dept ID*" {...field} />
        )}
      />
      {errors.dept_id && <p style={{ color:'red' }}>{errors.dept_id.message}</p>}

      <Controller name="visit_type" control={control}
        rules={{ required:'Required' }}
        render={({ field }) => (
          <select className="form-control" {...field}>
            <option value="">Visit Type*</option>
            <option value="fresh">Fresh</option>
            <option value="old">Old</option>
            <option value="follow_up">Follow Up</option>
          </select>
        )}
      />
      {errors.visit_type && <p style={{ color:'red' }}>{errors.visit_type.message}</p>}

      <Controller name="primary_doctor_id" control={control}
        render={({ field }) => (
          <input type="number" className="form-control" placeholder="Primary Doctor ID" {...field} />
        )}
      />

      <button type="submit" className="btn-primary" disabled={mut.isLoading}>
        {mut.isLoading ? 'Saving…' : 'Save & Print Case Paper'}
      </button>
    </form>
  );
}
