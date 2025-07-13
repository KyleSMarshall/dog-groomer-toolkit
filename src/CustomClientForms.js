import React, { useState, useEffect, useContext } from 'react';
import { DataStore } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { Client } from './models';
import { TextField, Button, Autocomplete, Modal } from '@mui/material';
import { DataContext } from './App';

function ClientForm({ initialData = {}, onSubmit, onCancel, title }) {
  const [form, setForm] = useState({
    Name: '',
    Phone_Number: '',
    Client_Since: null,
    ...initialData
  });
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState({ open: false, message: '', isError: false });

  // pure validation logic
  const validate = fields => {
    const errs = {};
    if (!fields.Name?.trim()) errs.Name = 'Name is required.';
    if (!fields.Phone_Number?.trim()) errs.Phone_Number = 'Phone number is required.';
    return errs;
  };

  const handleChange = field => e => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => { const { [field]: _, ...rest } = prev; return rest; });
  };

  const handleBlur = field => () => {
    const fieldErrs = validate({ [field]: form[field] });
    setErrors(prev => ({ ...prev, ...fieldErrs }));
  };

  const handleSubmit = async () => {
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setModal({ open: true, message: 'Please fix errors.', isError: true });
      return;
    }
    try {
      await onSubmit(form);
      setModal({ open: true, message: `${title} successful!`, isError: false });
      setTimeout(() => setModal({ ...modal, open: false }), 1200);
    } catch (err) {
      setModal({ open: true, message: err.message || 'Operation failed.', isError: true });
    }
  };

  const closeModal = () => setModal(prev => ({ ...prev, open: false }));

  return (
    <>
      <div className="form-container">
        <h2>{title}</h2>
        <TextField
          label="Name"
          value={form.Name}
          onChange={handleChange('Name')}
          onBlur={handleBlur('Name')}
          error={!!errors.Name}
          helperText={errors.Name || ''}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Phone number"
          value={form.Phone_Number}
          onChange={handleChange('Phone_Number')}
          onBlur={handleBlur('Phone_Number')}
          error={!!errors.Phone_Number}
          helperText={errors.Phone_Number || ''}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>Save</Button>
        <Button variant="contained" onClick={onCancel} style={{ marginLeft: 8 }}>Cancel</Button>
      </div>

      <Modal open={modal.open} onClose={closeModal}>
        <div style={{ padding: 20, background: '#fff', margin: '30vh auto', maxWidth: 400, borderRadius: 5 }}>
          <p style={{ color: modal.isError ? 'red' : 'black' }}>{modal.message}</p>
          <Button onClick={closeModal}>Ok</Button>
        </div>
      </Modal>
    </>
  );
}

export function CreateClient() {
  const navigate = useNavigate();
  const submitCreate = async data => {
    await DataStore.save(new Client({
      Name: data.Name,
      Phone_Number: data.Phone_Number,
      Client_Since: data.Client_Since
    }));
    navigate('/Dataviewer');
  };
  return (
    <ClientForm
      title="Create Client"
      onSubmit={submitCreate}
      onCancel={() => navigate('/Dataviewer')}
    />
  );
}

export function UpdateClient() {
  const { selectedData } = useContext(DataContext);
  const navigate = useNavigate();
  const initial = selectedData ? { Name: selectedData.Name, Phone_Number: selectedData.Phone_Number } : {};

  const submitUpdate = async data => {
    const orig = await DataStore.query(Client, selectedData.id);
    const changes = {};
    if (data.Name !== selectedData.Name) changes.Name = data.Name;
    if (data.Phone_Number !== selectedData.Phone_Number) changes.Phone_Number = data.Phone_Number;
    if (Object.keys(changes).length) {
      await DataStore.save(Client.copyOf(orig, c => Object.assign(c, changes)));
    }
    navigate('/Dataviewer');
  };

  return (
    <ClientForm
      title="Update Client"
      initialData={initial}
      onSubmit={submitUpdate}
      onCancel={() => navigate('/Dataviewer')}
    />
  );
}
