import React, { useState, useEffect, useContext } from 'react';
import { DataStore } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { Client } from './models';
import { TextField, Button, Autocomplete, Modal } from '@mui/material';
import { DataContext } from './App';

export function CreateClient() {
    // Client states
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [clientSince, setClientSince] = useState(null);
    // Helper states
    const [errors, setErrors] = useState({});
    const [errorModalOpen, setErrorModalOpen] = useState(false); // Popup modal
    const [successModalOpen, setSuccessModalOpen] = useState(false); // Popup modal
    const [modalMessage, setModalMessage] = useState('');

    const errorBorderColor = 'red';
    const noErrorBorderColor = '#cee9e3';

    const navigate = useNavigate();

    const validateField = (fieldId) => {
        let tempErrors = { ...errors };

        switch (fieldId) {
            case 'client-create-name':
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
            case 'client-create-phone':
                if (!phone.trim()) {
                    tempErrors.phone = "A phone number is required.";
                    const el = document.getElementById(fieldId);
                    el.style.borderColor = errorBorderColor;
                }
                else {
                    delete tempErrors.phone;
                    const el = document.getElementById(fieldId);
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
        Object.assign(tempErrors, validateField("client-create-name"));
        Object.assign(tempErrors, validateField("client-create-phone"));
        return tempErrors;
    };

    const handleSubmit = async () => {
        const tempErrors = validateForm();
        if (Object.keys(tempErrors).length === 0) {
            try {
                await DataStore.save(new Client({
                    "Name": name,
                    "Phone_Number": phone,
                    "Client_Since": clientSince,
                }));
                setModalMessage("Client created successfully!");
                setSuccessModalOpen(true);
                setTimeout(() => {
                    setSuccessModalOpen(false);
                    navigate('/Dataviewer');
                }, 1200);
            } catch (error) {
                setModalMessage("Client creation error - call Kyle .. lol :(");
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
                    id="client-create-name"
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    fullWidth 
                    onBlur={() => validateField("client-create-name")}
                    error={!!errors.name}
                />
                <TextField 
                    label="Phone number" 
                    id="client-create-phone"
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    fullWidth
                    onBlur={() => validateField("client-create-phone")}
                    error={!!errors.phone}
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

export function UpdateClient() {
    const { selectedData: clientData, setSelectedData: setClientData } = useContext(DataContext);
    // Client states
    const [id, setId] = useState('')
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [clientSince, setClientSince] = useState(null);
    // Helper states
    const [errors, setErrors] = useState({});
    const [errorModalOpen, setErrorModalOpen] = useState(false); // Popup modal
    const [successModalOpen, setSuccessModalOpen] = useState(false); // Popup modal
    const [modalMessage, setModalMessage] = useState('');

    const navigate = useNavigate();

    const errorBorderColor = 'red';
    const noErrorBorderColor = '#cee9e3';

    const initalizeFormFields = () => {
        if (clientData) {
            setId(clientData.id);
            setName(clientData.Name);
            setPhone(clientData.Phone_Number)
        }
    };

    useEffect(() => {
        initalizeFormFields();
    }, []);

    const validateField = (fieldId) => {
        let tempErrors = { ...errors };

        switch (fieldId) {
            case 'client-update-name':
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
            case 'client-update-phone':
                if (!phone.trim()) {
                    tempErrors.phone = "Phone number is required.";
                    const el = document.getElementById(fieldId);
                    el.style.borderColor = errorBorderColor;
                }
                else {
                    delete tempErrors.phone;
                    const el = document.getElementById(fieldId);
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
        Object.assign(tempErrors, validateField("client-update-name"));
        Object.assign(tempErrors, validateField("client-update-phone"));
        return tempErrors;
    };

    const checkForChanges = () => {
        let updatedAttributes = {};
    
        if (clientData.Name !== name) updatedAttributes.Name = name;
        if (clientData.Phone_Number !== phone) updatedAttributes.Phone_Number = phone;
    
        return updatedAttributes;
    };

    const handleSubmit = async () => {
        const tempErrors = validateForm();
        if (Object.keys(tempErrors).length === 0) {
            try {
                const clientOriginal = await DataStore.query(Client, id);
                if (!clientOriginal) {
                    console.error("No matching client record found. Aborting save.");
                    return;
                }
                const changes = checkForChanges()
                if (Object.keys(changes).length) {
                    await DataStore.save(
                        Client.copyOf(clientOriginal, updatedClient => {
                            for (let key in changes) {
                                updatedClient[key] = changes[key];
                            }
                        })
                    );
                    setModalMessage("Client updated successfully!");
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
                setModalMessage(`Client update failed with error\n {error}`);
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
                    id="client-update-name"
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    fullWidth 
                    onBlur={() => validateField("client-update-name")}
                    error={!!errors.name}
                />
                <TextField 
                    label="Phone" 
                    id="client-update-phone"
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    fullWidth
                    onBlur={() => validateField("client-update-phone")}
                    error={!!errors.phone}
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
