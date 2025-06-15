import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/apiClient';

export default function DispenseForm({ prescription }) {
  const qc = useQueryClient();
  const pid = prescription.prescription_id;
  const { register, handleSubmit, watch, formState:{ errors } } = useForm({
    defaultValues: JSON.parse(localStorage.getItem(`dispenseDraft-${pid}`)||'{}')
  });

  useEffect(()=>{
    const sub = watch(val => localStorage.setItem(`dispenseDraft-${pid}`, JSON.stringify(val)));
    return ()=> sub.unsubscribe();
  }, [watch, pid]);

  const m = useMutation(async data => {
    const { data: invs } = await api.get('/invoices');
    const inv = invs.find(i => i.visit.visit_id === prescription.visit_id);
    return api.post(`/invoices/${inv.invoice_id}/payments`, {
      amount_paid:  data.amount_paid,
      method:       data.method,
      reference_id: data.reference_id
    });
  }, {
    onSuccess: () => {
      qc.invalidateQueries(['todayPresc']);
      localStorage.removeItem(`dispenseDraft-${pid}`);
      window.print();
    }
  });

  return (
    <form onSubmit={handleSubmit(m.mutate)}>
      <input
        className="form-control"
        type="number"
        step="0.01"
        placeholder="Amount Paid"
        {...register('amount_paid',{ required:'Required', min:{value:0,message:'≥0'} })}
      />
      {errors.amount_paid && <p style={{ color:'red' }}>{errors.amount_paid.message}</p>}

      <select className="form-control" {...register('method',{ required:'Required' })}>
        <option value="">Method</option>
        <option>NEFT</option>
        <option>Card</option>
        <option>Cash</option>
        <option>UPI</option>
      </select>
      {errors.method && <p style={{ color:'red' }}>{errors.method.message}</p>}

      <input
        className="form-control"
        placeholder="Reference ID"
        {...register('reference_id',{ required:'Required' })}
      />
      {errors.reference_id && <p style={{ color:'red' }}>{errors.reference_id.message}</p>}

      <button type="submit" className="btn-secondary">
        Dispense & Print Bill
      </button>
    </form>
  );
}
