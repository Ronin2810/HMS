import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/apiClient';

export default function ReportForm() {
  const qc = useQueryClient();
  const { control, handleSubmit, watch, formState:{ errors } } = useForm({
    defaultValues: JSON.parse(localStorage.getItem('reportDraft')||'{}')
  });

  useEffect(() => {
    const sub = watch(val => localStorage.setItem('reportDraft', JSON.stringify(val)));
    return () => sub.unsubscribe();
  }, [watch]);

  const m = useMutation(data =>
    api.post('/reports', {
      patient_id: data.patient_id,
      visit_id:   data.visit_id || null,
      dept_id:    Number(data.dept_id),
      file_url:   data.file_url,
      file_type:  data.file_type,
      metadata:   { notes: data.notes }
    }), {
      onSuccess: () => {
        qc.invalidateQueries(['reports']);
        localStorage.removeItem('reportDraft');
      }
    }
  );

  return (
    <form onSubmit={handleSubmit(m.mutate)}>
      <Controller name="patient_id" control={control}
        rules={{ required:'Required' }}
        render={({ field }) => (
          <input className="form-control" placeholder="Patient ID*" {...field} />
        )}
      />
      {errors.patient_id && <p style={{ color:'red' }}>{errors.patient_id.message}</p>}

      <Controller name="visit_id" control={control}
        render={({ field }) => (
          <input className="form-control" placeholder="Visit ID (optional)" {...field} />
        )}
      />

      <Controller name="dept_id" control={control}
        rules={{ required:'Required', min:{ value:1,message:'≥1' } }}
        render={({ field }) => (
          <input type="number" className="form-control" placeholder="Dept ID*" {...field} />
        )}
      />
      {errors.dept_id && <p style={{ color:'red' }}>{errors.dept_id.message}</p>}

      <Controller name="file_url" control={control}
        rules={{ required:'Required' }}
        render={({ field }) => (
          <input className="form-control" placeholder="File URL*" {...field} />
        )}
      />
      {errors.file_url && <p style={{ color:'red' }}>{errors.file_url.message}</p>}

      <Controller name="file_type" control={control}
        rules={{ required:'Required' }}
        render={({ field }) => (
          <input className="form-control" placeholder="File Type*" {...field} />
        )}
      />
      {errors.file_type && <p style={{ color:'red' }}>{errors.file_type.message}</p>}

      <Controller name="notes" control={control}
        render={({ field }) => (
          <textarea className="form-control" placeholder="Notes" {...field} />
        )}
      />

      <button type="submit" className="btn-primary">
        Save Report
      </button>
    </form>
  );
}
