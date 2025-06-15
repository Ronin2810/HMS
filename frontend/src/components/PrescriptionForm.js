import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/apiClient';

export default function PrescriptionForm({ visitId, patientId }) {
  const qc = useQueryClient();
  const { control, handleSubmit, watch, formState:{ errors } } = useForm({
    defaultValues: JSON.parse(localStorage.getItem(`prescDraft-${visitId}`) 
      || JSON.stringify({ medicines:[{ name:'', qty:1, dose:'' }] }))
  });
  const { fields, append, remove } = useFieldArray({ name:'medicines', control });

  useEffect(()=>{
    const sub = watch(val => localStorage.setItem(`prescDraft-${visitId}`, JSON.stringify(val)));
    return ()=> sub.unsubscribe();
  }, [watch, visitId]);

  const m = useMutation(data =>
    api.post(`/visits/${visitId}/prescriptions`, { patient_id: patientId, medicines: data.medicines }),
    {
      onSuccess: () => {
        qc.invalidateQueries(['presc', visitId]);
        localStorage.removeItem(`prescDraft-${visitId}`);
        window.print();
      }
    }
  );

  return (
    <form onSubmit={handleSubmit(m.mutate)}>
      {fields.map((f,i) => (
        <div key={f.id} style={{ marginBottom:'1rem' }}>
          <input
            className="form-control"
            placeholder="Medicine Name"
            {...control.register(`medicines.${i}.name`, { required:'Required' })}
          />
          {errors.medicines?.[i]?.name && <p style={{ color:'red' }}>{errors.medicines[i].name.message}</p>}

          <input
            className="form-control"
            type="number"
            placeholder="Qty"
            {...control.register(`medicines.${i}.qty`, { required:'Required', min:{value:1,message:'≥1'} })}
          />
          {errors.medicines?.[i]?.qty && <p style={{ color:'red' }}>{errors.medicines[i].qty.message}</p>}

          <input
            className="form-control"
            placeholder="Dose"
            {...control.register(`medicines.${i}.dose`, { required:'Required' })}
          />
          {errors.medicines?.[i]?.dose && <p style={{ color:'red' }}>{errors.medicines[i].dose.message}</p>}

          <button type="button" className="btn-secondary" onClick={()=>remove(i)}>
            Remove
          </button>
        </div>
      ))}

      <button type="button" className="btn-secondary" onClick={()=>append({ name:'', qty:1, dose:'' })}>
        Add Medicine
      </button>

      <button type="submit" className="btn-primary">
        Save & Print Prescription
      </button>
    </form>
  );
}
