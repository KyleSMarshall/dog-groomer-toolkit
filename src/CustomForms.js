import React, { useState, useEffect } from 'react';
import { DataStore } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { Dog, Event, Client } from './models';
import { TextField, Button, Autocomplete } from '@mui/material';

export function CreateDog() {
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchClients = async () => {
            const clientsData = await DataStore.query(Client);
            setClients(clientsData);
        };
        fetchClients();
    }, []);

    const handleSubmit = async () => {
        await DataStore.save(new Dog({
            Name: name,
            Breed: breed,
            Age: new Date(new Date().getFullYear() - age, 0, 1).toISOString(),
            ClientID: selectedClient.id
        }));
        navigate('/Dataviewer');
    };

    return (
        <div className="form-container">
            <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth />
            <TextField label="Breed" value={breed} onChange={e => setBreed(e.target.value)} fullWidth />
            <TextField label="Age" value={age} onChange={e => setAge(e.target.value)} type="number" fullWidth />
            <Autocomplete
                options={clients}
                getOptionLabel={(option) => option.Name}
                onChange={(event, newValue) => setSelectedClient(newValue)}
                renderInput={(params) => <TextField {...params} label="Client" fullWidth/>}
            />
            <Button variant="contained" color="primary" onClick={handleSubmit}>Save</Button>
            <Button variant="contained" onClick={() => navigate('/Dataviewer')}>Cancel</Button>
        </div>
    );
}

export function UpdateDog() {
    const [dog, setDog] = useState(null);

    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDog = async (id) => {
            const fetchedDog = await DataStore.query(Dog, id);
            setDog(fetchedDog);
        };
        fetchDog();  // TODO: You might want to pass the actual ID here
    }, []);

    const handleSubmit = async () => {
        if (dog) {
            await DataStore.save(Dog.copyOf(dog, updated => {
                updated.Name = name;
                updated.Breed = breed;
                updated.Age = new Date(new Date().getFullYear() - age, 0, 1).toISOString();
            }));
        }
        navigate('/Dataviewer');
    };

    if (!dog) return <div>Loading...</div>;

    return (
        <div className="form-container">
            <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth />
            <TextField label="Breed" value={breed} onChange={e => setBreed(e.target.value)} fullWidth />
            <TextField label="Age" value={age} onChange={e => setAge(e.target.value)} type="number" fullWidth />
            <Autocomplete
                options={clients}
                getOptionLabel={(option) => option.Name}
                style={{ width: 300 }}
                onChange={(event, newValue) => setSelectedClient(newValue)}
                renderInput={(params) => <TextField {...params} label="Client" variant="outlined" />}
            />
            <Button variant="contained" color="primary" onClick={handleSubmit}>Save</Button>
            <Button variant="contained" onClick={() => navigate('/Dataviewer')}>Cancel</Button>
        </div>
    );
}
