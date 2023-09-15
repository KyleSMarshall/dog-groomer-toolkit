import React, { useState, useEffect, useContext } from 'react';
import { DataStore } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { Dog, Event, Client } from './models';
import { TextField, Button, Autocomplete, Modal, Select, MenuItem } from '@mui/material';
import { DataContext } from './App';

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
    const [modalMessage, setModalMessage] = useState('');

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
            try {
                await DataStore.save(new Dog({
                    "Name": name,
                    "Breed": breed,
                    "Age": awsAge,
                    "Temperment": temperment,
                    "Planned_Frequency": plannedFrequency,
                    "Style": style,
                    "Notes": notes,
                    "Client": selectedClient
                }));
            } catch (error) {
                console.log("error:", error);
            }
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
                <div style={{ padding: "20px", background: "#fff", margin: "30vh auto", maxWidth: "400px", borderRadius: "5px"}}>
                    <p>{modalMessage}</p>
                </div>
            </Modal>
        </>
    );
}

export function UpdateDog() {
    const { selectedData: dogData, setSelectedData: setDogData } = useContext(DataContext);
    const [id, setId] = useState('')
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');
    const [temperment, setTemperment] = useState('');
    const [plannedFrequency, setPlannedFrequency] = useState('');
    const [style, setStyle] = useState('');
    const [notes, setNotes] = useState('');
    const [clients, setClients] = useState([])
    const [clientId, setClientId] = useState('');
    const [selectedClient, setSelectedClient] = useState('');
    const [originalSelectedClient, setOriginalSelectedClient] = useState(null);
    const [errors, setErrors] = useState({});
    const [errorModalOpen, setErrorModalOpen] = useState(false); // Popup modal
    const [successModalOpen, setSuccessModalOpen] = useState(false); // Popup modal
    const [modalMessage, setModalMessage] = useState('');

    const navigate = useNavigate();

    const errorBorderColor = 'red';
    const noErrorBorderColor = '#cee9e3';

    const initalizeFormFields = () => {
        if (dogData) {
            setId(dogData.id);
            setName(dogData.Name);
            setBreed(dogData.Breed);
            setAge(dateDifferenceInYears(dogData.Age) || '');
            setTemperment(dogData.Temperment);
            setPlannedFrequency(dogData.Planned_Frequency);
            setStyle(dogData.Style);
            setNotes(dogData.Notes);
            setClientId(dogData.dogClientId);
        }
    };

    const dateDifferenceInYears = (dateStr) => {
        if (!dateStr) {
            return '';
        }
        const currentDate = new Date();
        const inputDate = new Date(dateStr);
    
        // Calculate the difference in milliseconds
        const differenceInMillis = currentDate - inputDate;
    
        // Convert milliseconds to years
        const differenceInYears = differenceInMillis / (1000 * 60 * 60 * 24 * 365.25);
    
        // Return years rounded to 1 decimal place
        return parseFloat(differenceInYears.toFixed(1));
    };

    useEffect(() => {
        const fetchClients = async () => {
            const clientsData = await DataStore.query(Client);
            setClients(clientsData);

            // Find the client object with the matching clientId from the fetched data
            const matchedClient = clientsData.find(client => client.id === dogData.dogClientId);
            // Update the selectedClient state if a matching client is found
            if (matchedClient) {
                setSelectedClient(matchedClient);
                setOriginalSelectedClient(matchedClient);
            }
        };
        initalizeFormFields();
        fetchClients();
    }, []);

    const validateField = (fieldId) => {
        let tempErrors = { ...errors };

        switch (fieldId) {
            case 'dog-update-name':
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
            case 'dog-update-breed':
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
            case 'dog-update-age':
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
            case 'dog-update-client':
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
        Object.assign(tempErrors, validateField("dog-update-name"));
        Object.assign(tempErrors, validateField("dog-update-breed"));
        Object.assign(tempErrors, validateField("dog-update-age"));
        Object.assign(tempErrors, validateField("dog-update-client"));
        return tempErrors;
    };

    const checkForChanges = () => {
        let updatedAttributes = {};
        let originalAttributes = {
            "Name": dogData.Name,
            "Breed": dogData.Breed,
            "Age": dogData.Age,
            "Planned_Frequency": dogData.Planned_Frequency,
            "Style": dogData.Style,
            "Temperment": dogData.Temperment,
            "id": dogData.id,
            "Notes": dogData.Notes,
        };

        const originalAge = dateDifferenceInYears(dogData.Age);
    
        if (dogData.Name !== name) updatedAttributes.Name = name;
        if (dogData.Breed !== breed) updatedAttributes.Breed = breed;
        if (originalAge !== age) updatedAttributes.Age = age;
        if (dogData.Style !== style) updatedAttributes.Style = style;
        if (dogData.Temperment !== temperment) updatedAttributes.Temperment = temperment;
        if (dogData.Planned_Frequency !== plannedFrequency) updatedAttributes.Planned_Frequency = plannedFrequency;
        if (dogData.Notes !== notes) updatedAttributes.Notes = notes;
        if (selectedClient !== originalSelectedClient) updatedAttributes.Client = selectedClient;
    
        return updatedAttributes;
    };

    const handleSubmit = async () => {
        const tempErrors = validateForm();
        if (Object.keys(tempErrors).length === 0) {
            try {
                const dogOriginal = await DataStore.query(Dog, id);
                if (!dogOriginal) {
                    console.error("No matching dog record found. Aborting save.");
                    return;
                }
                const changes = checkForChanges()
                if (Object.keys(changes).length) {
                    if (changes.hasOwnProperty('Age')) {
                        if (!changes.Age) {
                            changes.Age = null;
                        } else {
                            const today = new Date();
                            const totalDays = changes.Age * 365.25;
                            const birthDate = new Date(today - totalDays * 24 * 60 * 60 * 1000); // convert days to milliseconds and subtract from today
                            changes.Age = `${birthDate.getFullYear()}-${String(birthDate.getMonth() + 1).padStart(2, '0')}-${String(birthDate.getDate()).padStart(2, '0')}`;
                        }
                    }
                    await DataStore.save(
                        Dog.copyOf(dogOriginal, updatedDog => {
                            for (let key in changes) {
                                updatedDog[key] = changes[key];
                            }
                        })
                    );
                    setModalMessage("Dog updated successfully!");
                    setSuccessModalOpen(true);
                    setTimeout(() => {
                        setSuccessModalOpen(false);
                        navigate('/Dataviewer');
                    }, 1200);
                } else {
                    setModalMessage("No changes to save!");
                    setSuccessModalOpen(true);
                    setTimeout(() => {
                        setSuccessModalOpen(false);
                    }, 1200);
                }
            } catch (error) {
                setModalMessage(`Dog update failed with error\n {error}`);
                setSuccessModalOpen(true);
                console.log("error:", error);
                setTimeout(() => {
                    setSuccessModalOpen(false);
                }, 1200);
            }
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
                    id="dog-update-name"
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    fullWidth 
                    onBlur={() => validateField("dog-update-name")}
                    error={!!errors.name}
                />
                <TextField 
                    label="Breed" 
                    id="dog-update-breed"
                    value={breed} 
                    onChange={e => setBreed(e.target.value)} 
                    fullWidth
                    onBlur={() => validateField("dog-update-breed")}
                    error={!!errors.breed}
                />
                <TextField 
                    label="Age"
                    id="dog-update-age"
                    value={age} 
                    onChange={e => setAge(e.target.value)} 
                    type="number" 
                    fullWidth
                    onBlur={() => validateField("dog-update-age")}
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
                    value={selectedClient ? selectedClient : null}
                    id="dog-update-client"
                    getOptionLabel={(option) => option ? option.Name : ''}
                    onChange={(event, newValue) => {
                        setSelectedClient(newValue);
                        const el = document.getElementById("dog-update-client").parentElement;
                        el.style.borderColor = noErrorBorderColor;
                    }}
                    renderInput={(params) => (
                        <TextField 
                            {...params} 
                            label="Client"
                            fullWidth
                            onBlur={() => validateField("dog-update-client")}
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
                <div style={{ padding: "20px", background: "#fff", margin: "30vh auto", maxWidth: "400px", borderRadius: "5px", textAlign: "left"}}>
                    <p>{modalMessage}</p>
                </div>
            </Modal>
        </>
    );
}
