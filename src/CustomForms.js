import React, { useState, useEffect } from 'react';
import { DataStore } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { Dog, Event, Client } from './models';
import { TextField, Button, Autocomplete, Modal } from '@mui/material';

export function CreateDog() {
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');
    const [temperment, setTemperment] = useState('');
    const [plannedFrequency, setPlannedFrequency] = useState('');
    const [style, setStyle] = useState('');
    const [notes, setNotes] = useState('');
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [errors, setErrors] = useState({});
    const [errorModalOpen, setErrorModalOpen] = useState(false); // Popup modal
    const [successModalOpen, setSuccessModalOpen] = useState(false); // Popup modal
    const [modalMessage, setModalMessage] = useState("");

    const errorBorderColor = 'red';
    const noErrorBorderColor = '#cee9e3';

    const navigate = useNavigate();

    useEffect(() => {
        const fetchClients = async () => {
            const clientsData = await DataStore.query(Client);
            setClients(clientsData);
        };
        fetchClients();
    }, []);

    const validateField = (fieldId) => {
        let tempErrors = { ...errors };

        switch (fieldId) {
            case 'dog-create-name':
                if (!name.trim()) {
                    tempErrors.name = "Name is required."; 
                    const el = document.getElementById(fieldId);
                    el.style.borderColor = errorBorderColor;
                }
                else {
                    delete tempErrors.name;
                    const el = document.getElementById(fieldId);
                    el.style.borderColor = noErrorBorderColor;
                }
                break;
            case 'dog-create-breed':
                if (!breed.trim()) {
                    tempErrors.breed = "Breed is required.";
                    const el = document.getElementById(fieldId);
                    el.style.borderColor = errorBorderColor;
                }
                else {
                    delete tempErrors.breed;
                    const el = document.getElementById(fieldId);
                    el.style.borderColor = noErrorBorderColor;
                }
                break;
            case 'dog-create-age':
                if (isNaN(age) || age<0) {
                    tempErrors.age = "Age must be a positive number or be empty.";
                    const el = document.getElementById(fieldId);
                    el.style.borderColor = errorBorderColor;
                }
                else {
                    delete tempErrors.age;
                    const el = document.getElementById(fieldId);
                    el.style.borderColor = noErrorBorderColor;
                }
                break;
            case 'dog-create-client':
                if (!selectedClient) {
                    tempErrors.client = "Client is required and must be selected from the dropdown list.";
                    const el = document.getElementById(fieldId).parentElement;
                    el.style.borderColor = errorBorderColor;
                }
                else {
                    delete tempErrors.client;
                    const el = document.getElementById(fieldId).parentElement;
                    el.style.borderColor = noErrorBorderColor;
                }
                break;
            default:
                break;
        }

        setErrors(tempErrors);
        return tempErrors;
    };

    const validateForm = () => {
        var tempErrors = {}
        Object.assign(tempErrors, validateField("dog-create-name"));
        Object.assign(tempErrors, validateField("dog-create-breed"));
        Object.assign(tempErrors, validateField("dog-create-age"));
        Object.assign(tempErrors, validateField("dog-create-client"));
        return tempErrors;
    };

    const handleSubmit = async () => {
        const tempErrors = validateForm();
        if (Object.keys(tempErrors).length === 0) {
            setModalMessage("Dog created successfully!");
            setSuccessModalOpen(true);
            
            var awsAge = null;

            if (age !== '') {
                const today = new Date();
                const totalDays = age * 365.25;
                const birthDate = new Date(today - totalDays * 24 * 60 * 60 * 1000); // convert days to milliseconds and subtract from today
                awsAge = `${birthDate.getFullYear()}-${String(birthDate.getMonth() + 1).padStart(2, '0')}-${String(birthDate.getDate()).padStart(2, '0')}`;

            }

            await DataStore.save(new Dog({
                Name: name,
                Breed: breed,
                Age: awsAge,
                Temperment: temperment,
                Planned_Frequency: plannedFrequency,
                Style: style,
                Notes: notes,
                ClientID: selectedClient.id
            }));
            setTimeout(() => {
                setSuccessModalOpen(false);
                navigate('/Dataviewer');
            }, 1200);
        } else {
            setModalMessage(Object.values(tempErrors).join('\n'));
            setErrorModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setErrorModalOpen(false);
        setSuccessModalOpen(false);
    };

    return (
        <>
            <div className="form-container">
                <TextField 
                    label="Name" 
                    id="dog-create-name"
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    fullWidth 
                    onBlur={() => validateField("dog-create-name")}
                    error={!!errors.name}
                />
                <TextField 
                    label="Breed" 
                    id="dog-create-breed"
                    value={breed} 
                    onChange={e => setBreed(e.target.value)} 
                    fullWidth
                    onBlur={() => validateField("dog-create-breed")}
                    error={!!errors.breed}
                />
                <TextField 
                    label="Age"
                    id="dog-create-age"
                    value={age} 
                    onChange={e => setAge(e.target.value)} 
                    type="number" 
                    fullWidth
                    onBlur={() => validateField("dog-create-age")}
                    error={!!errors.age}
                />
                <TextField 
                    label="Temperament" 
                    value={temperment} 
                    onChange={e => setTemperment(e.target.value)} 
                    fullWidth 
                />
                <TextField 
                    label="Planned Frequency" 
                    value={plannedFrequency} 
                    onChange={e => setPlannedFrequency(e.target.value)} 
                    fullWidth 
                />
                <TextField 
                    label="Style" 
                    value={style} 
                    onChange={e => setStyle(e.target.value)} 
                    fullWidth 
                />
                <TextField 
                    label="Notes" 
                    value={notes} 
                    onChange={e => setNotes(e.target.value)} 
                    fullWidth 
                />
                <Autocomplete
                    options={clients}
                    id="dog-create-client"
                    getOptionLabel={(option) => option.Name}
                    onChange={(event, newValue) => {
                        setSelectedClient(newValue);
                        const el = document.getElementById("dog-create-client").parentElement;
                        el.style.borderColor = noErrorBorderColor;
                    }}
                    renderInput={(params) => (
                        <TextField 
                            {...params} 
                            label="Client"
                            fullWidth
                            onBlur={() => validateField("dog-create-client")}
                            error={!!errors.client}
                        />
                    )}
                />
                <Button variant="contained" color="primary" onClick={handleSubmit}>Save</Button>
                <Button variant="contained" onClick={() => navigate('/Dataviewer')}>Cancel</Button>
            </div>

            <Modal open={errorModalOpen} onClose={handleCloseModal}>
                <div style={{ padding: "20px", background: "#fff", margin: "30vh auto", maxWidth: "400px", borderRadius: "5px"}}>
                    <p>{modalMessage}</p>
                    <Button className='data-action-link error-modal' onClick={handleCloseModal}>Ok</Button>
                </div>
            </Modal>
            <Modal open={successModalOpen} onClose={handleCloseModal}>
                <div style={{ padding: "20px", background: "#fff", margin: "30vhauto", maxWidth: "400px", borderRadius: "5px"}}>
                    <p>{modalMessage}</p>
                </div>
            </Modal>
        </>
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
