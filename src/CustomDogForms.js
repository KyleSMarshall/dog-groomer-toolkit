import React, { useState, useEffect, useContext } from 'react';
import { DataStore } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { Dog, Client } from './models';
import {
  TextField,
  Button,
  Autocomplete,
  Modal,
  Typography,
  Box
} from '@mui/material';
import { DataContext } from './App';

// Reusable DogForm component for Create and Update
export function DogForm({ initialValues = {}, onSubmit, mode = 'create' }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    Name: '',
    Breed: '',
    Age: '',
    Temperment: '',
    Planned_Frequency: '',
    Style: '',
    Notes: '',
    Client: null,
    ...initialValues
  });
  const [clients, setClients] = useState([]);
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState({ open: false, message: '', isError: false });

  // Load clients
  useEffect(() => {
    DataStore.query(Client).then(setClients);
  }, []);

  // Validation logic: returns an errors object
  const validate = (fields = form) => {
    const errs = {};
    if (!fields.Name.trim()) errs.Name = 'Name is required.';
    if (!fields.Breed.trim()) errs.Breed = 'Breed is required.';
    if (fields.Age !== '' && (isNaN(fields.Age) || fields.Age < 0))
      errs.Age = 'Age must be a positive number or empty.';
    if (!fields.Client) errs.Client = 'Client is required.';
    return errs;
  };

  const handleChange = (field) => (e, value) => {
    const val = field === 'Client' ? value : e.target.value;
    setForm((f) => ({ ...f, [field]: val }));
    if (errors[field]) {
      setErrors((errs) => {
        const { [field]: _, ...rest } = errs;
        return rest;
      });
    }
  };

  const handleBlur = (field) => () => {
    const fieldErrs = validate({ [field]: form[field] });
    setErrors((errs) => ({ ...errs, ...fieldErrs }));
  };

  const handleSubmit = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) {
      setModal({ open: true, message: 'Please fix errors before saving.', isError: true });
      return;
    }
    try {
      await onSubmit(form);
      setModal({ open: true, message: `Dog ${mode}d successfully!`, isError: false });
      setTimeout(() => navigate('/Dataviewer'), 1000);
    } catch (e) {
      setModal({ open: true, message: e.message || 'Operation failed.', isError: true });
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', my: 4, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        {mode === 'create' ? 'Create Dog' : 'Update Dog'}
      </Typography>
      {/** Form fields **/}
      {['Name', 'Breed', 'Temperment', 'Planned_Frequency', 'Style', 'Notes'].map((field) => (
        <TextField
          key={field}
          label={field.replace('_', ' ')}
          value={form[field]}
          onChange={handleChange(field)}
          onBlur={handleBlur(field)}
          error={!!errors[field]}
          helperText={errors[field] || ' '}
          fullWidth
          margin="normal"
        />
      ))}
      <TextField
        label="Age"
        type="number"
        value={form.Age}
        onChange={handleChange('Age')}
        onBlur={handleBlur('Age')}
        error={!!errors.Age}
        helperText={errors.Age || ' '}
        fullWidth
        margin="normal"
      />
      <Autocomplete
        options={clients}
        getOptionLabel={(opt) => opt.Name || ''}
        value={form.Client}
        onChange={(e, v) => handleChange('Client')(e, v)}
        onBlur={handleBlur('Client')}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Client"
            error={!!errors.Client}
            helperText={errors.Client || ' '}
            margin="normal"
            fullWidth
          />
        )}
      />

      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={handleSubmit} disabled={Object.keys(errors).length > 0}>
          Save
        </Button>
        <Button variant="outlined" onClick={() => navigate('/Dataviewer')}>
          Cancel
        </Button>
      </Box>

      <Modal open={modal.open} onClose={() => setModal((m) => ({ ...m, open: false }))}>
        <Box sx={{ p: 3, bgcolor: '#fff', m: '20vh auto', maxWidth: 400, borderRadius: 1 }}>
          <Typography color={modal.isError ? 'error' : 'primary'}>
            {modal.message}
          </Typography>
          <Box sx={{ textAlign: 'right', mt: 2 }}>
            <Button onClick={() => setModal((m) => ({ ...m, open: false }))}>
              OK
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

// CreateDog using DogForm
export function CreateDog() {
  const submitCreate = async (data) => {
    let awsAge = null;
    if (data.Age !== '') {
      const days = data.Age * 365.25;
      awsAge = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];
    }
    await DataStore.save(
      new Dog({
        ...data,
        Age: awsAge,
      })
    );
  };
  return <DogForm mode="create" onSubmit={submitCreate} />;
}

// UpdateDog using DogForm
export function UpdateDog() {
  const { selectedData } = useContext(DataContext);
  const init = selectedData
    ? {
        ...selectedData,
        Age: selectedData.Age // keep as years if already converted
      }
    : {};

  const submitUpdate = async (data) => {
    const orig = await DataStore.query(Dog, selectedData.id);
    const changes = {};
    Object.keys(data).forEach((key) => {
      if (data[key] !== selectedData[key]) {
        changes[key] = key === 'Age' && data.Age !== ''
          ? new Date(Date.now() - data.Age * 365.25 * 86400000).toISOString().split('T')[0]
          : data[key];
      }
    });
    if (Object.keys(changes).length) {
      await DataStore.save(
        Dog.copyOf(orig, (d) => Object.assign(d, changes))
      );
    }
  };

  return <DogForm mode="update" initialValues={init} onSubmit={submitUpdate} />;
}
