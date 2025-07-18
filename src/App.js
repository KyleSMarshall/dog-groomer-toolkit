import './App.css';
import React, { useRef, useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, useLocation, useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { 
  ClientCreateForm, 
  ClientUpdateForm, 
  DogCreateForm, 
  DogUpdateForm, 
  EventCreateForm,
  EventUpdateForm
} from './ui-components';
import { CreateDog, UpdateDog } from './CustomDogForms';
import { CreateClient, UpdateClient } from './CustomClientForms';
import './CustomForms.css';


import {Amplify, DataStore} from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import { Event, Client, Dog } from './models';
import { DataGrid, GridToolbarContainer, GridSearchIcon, GridToolbarQuickFilter} from '@mui/x-data-grid';
import { Button, Modal, TextField, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import './DataViewer.css';

const DataContext = React.createContext();

function Calendar() {
  const [loading, setLoading] = useState(true);
  const calendarRef = useRef(null);
  const [events, setEvents] = React.useState([]);
  // State for modal visibility
  const [isModalOpen, setModalOpen] = useState(false);
  // State for the event that was clicked
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [value, setValue] = useState('');

  // Handler for event double click
  const handleEventDoubleClick = (info) => {
      if (info.view.type === 'timeGridDay') {
          setSelectedEvent(info.event);
          setModalOpen(true);
      }
  };

  // Close modal function
  const closeModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  const handleEventSave = async () => {
      let button = document.querySelector('.amplify-button[type="submit"]');
      if (button) {
        button.click();
      }
  }

  const updateEvent = (updatedEventData) => {
    closeModal();
  };

  const formatToHourAndMinutes = (datetimeStr) => {
    let hours = parseInt(datetimeStr.slice(11, 13), 10);
    const minutes = datetimeStr.slice(14, 16);
    let period = 'AM';
    if (hours >= 12) {
        period = 'PM';
        if (hours > 12) hours -= 12;
    } else if (hours === 0) {
        hours = 12; // for midnight
    }
    return `${hours}:${minutes} ${period}`;
  };

  React.useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);  // Show loading spinner while the data loads
      try {
        const eventData = await DataStore.query(Event);
        const dogData = await DataStore.query(Dog);
        const clientData = await DataStore.query(Client);

        // Convert dogData and clientData into objects for faster lookups
        const dogLookup = dogData.reduce((acc, dog) => ({ ...acc, [dog.id]: dog }), {});
        const clientLookup = clientData.reduce((acc, client) => ({ ...acc, [client.id]: client }), {});

        // Transform to a format FullCalendar understands
        // Map events and attach related data
        const transformedEvents = eventData.map(event => {
          const dog = dogLookup[event.eventDogId];
          const client = clientLookup[dog.dogClientId];
          const dogName = dog ? dog.Name : "";
          const dogBreed = dog ? dog.Breed : "";
          const clientName = client ? client.Name : "";
          const clientPhoneNumber = client ? client.Phone_Number : "";
          const apptType = event ? event.Type : "";
          const apptTime = formatToHourAndMinutes(event.Time_Start);
          const title = `${dogName}-${dogBreed}-${apptTime}`;
          return {
            dogName: dog.Name,
            dogId: dog.id,
            dogBreed: dog.Breed,
            dogStyle: dog.Style,
            clientName: client.Name,
            clientNumber: client.Phone_Number,
            apptTime: apptTime,
            start: event.Time_Start,
            type: event.Type,
            end: event.Time_End,
            title: title,
            id: event.id,
        };
        });
        setEvents(transformedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }    
    };
    fetchEvents();
  }, []);

  const renderEventContent = (eventInfo) => {
    const { dogName, dogBreed, dogStyle, clientName, clientNumber, type, apptTime } = eventInfo.event.extendedProps;
  
    if (eventInfo.view.type === 'dayGridMonth') {
      // Title for month view
      return (
        <>
        <div className='fc-daygrid-event-dot'></div>
        <div className='fc-event-title'>{`${dogName}-${dogBreed}-${apptTime}`}</div>
        </>
      );
    } else {
      // Title for day view or any other view
      return (
        <>
        <div className='fc-dayview-title-custom'>
        {`${dogName} - ${dogBreed} - ${type}`}
        <br />
        {`${clientName} - ${clientNumber}`}
        </div>
        </>
      );
    }
  };

  const handleDateClick = (arg) => {
    if (arg.view.type === 'dayGridMonth') {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView('timeGridDay', arg.date);
    }
  }

  return (
    <div className='calendar-container'>
      {loading ? (
        <div className="loading-spinner">
          <CircularProgress />
        </div>
      ) : (
      <FullCalendar
        ref={calendarRef}
        plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
        dateClick={handleDateClick}
        initialView='dayGridMonth'
        weekends={true}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        slotMinTime={"08:00:00"}
        slotMaxTime={"19:00:00"}
        nowIndicator={true}
        allDaySlot={false}
        expandRows={true}
        events={events}
        height={'100%'}
        eventContent={renderEventContent}
        eventClick={handleEventDoubleClick}
      />
      )}
      <Modal
        open={isModalOpen}
        onClose={closeModal}
      >
        
        <div style={{ padding: "20px", background: "#fff", margin: "10vh auto", maxWidth: "400px", borderRadius: "5px"}}>
            {/**
            <h2>Edit Event</h2>
            <input 
                defaultValue={selectedEvent ? selectedEvent.title : ''} 
                placeholder="Title" 
                onChange={(e) => setSelectedEvent(prev => ({ ...prev, title: e.target.value }))} 
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker 
                value={value ? value : "Select a date"} 
                onChange={(newValue) => setValue(newValue)} 
                defaultValue={'yy'}
              />
            </LocalizationProvider>
        */}
            <EventUpdateForm
              id={selectedEvent ? selectedEvent.id : ''}
            />
            <div id="event-update-button-container">
              <Button id="event-update-cancel" onClick={closeModal}>Cancel</Button>
              <Button id="event-update-save" onClick={handleEventSave}>Save</Button>
            </div>
        </div>
      </Modal>
    </div>
  );
}

function SideMenu() {
    const location = useLocation();

    return (
        <div className="side-menu">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                Calendar
            </Link>
            <Link to="/Dataviewer" className={location.pathname === '/Dataviewer' ? 'active' : ''}>
                Data Viewer
            </Link>
        </div>
    );
}

function DataViewer() {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [rowData, setRowData] = React.useState(null);
  const [notes, setNotes] = React.useState('');
  const [originalNotes, setOriginalNotes] = React.useState('');
  const [showSaveButton, setShowSaveButton] = React.useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  
  const [activeView, setActiveView] = useState('dogs'); // default view is 'dogs'

  const [dogData, setDogData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const { setSelectedData } = React.useContext(DataContext);
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();

  const handleOpen = (params) => {
    setRowData(params.row);
    setNotes(params.row.Notes || "");
    setOriginalNotes(params.row.Notes || "");
    setShowSaveButton(false);
    setShowConfirmModal(false);
    setOpen(true);
  };
  
  const handleClose = () => {
    if (showSaveButton) {
      setShowConfirmModal(true);
    } else {
        setOpen(false);
    }
  };

  const handleSaveAndClose = async () => {
    await handleSaveChanges();
    setOpen(false);
    setShowConfirmModal(false);
  };

  const handleDiscardAndClose = () => {
    setOpen(false);
    setShowConfirmModal(false);
  };
  
  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    if (newNotes !== originalNotes) {
      setShowSaveButton(true);
    } else {
      setShowSaveButton(false);
    }
  };
  
  const handleSaveChanges = () => {
    // The main logic is wrapped inside an asynchronous helper function
    const saveChangesAsync = async () => {
      // Save the changes to the database
      const dogId = rowData.id || null;
  
      if (!dogId) {
        console.error("No dog Id found. Aborting save.");
        setOpen(false);
        return;
      }
  
      const dogOriginal = await DataStore.query(Dog, dogId);
  
      if (!dogOriginal) {
        console.error("No matching dog record found. Aborting save.");
        return;
      }
      
      await DataStore.save(
        Dog.copyOf(dogOriginal, updated => {
          updated.Notes = notes;
        })
      );

      // Locally update the corresponding dog's notes in the dogData state
      const updatedDogData = dogData.map(row => {
        if (row.id === dogId) {
          return { ...row, Notes: notes };
        }
        return row;
      });

      // Update the dogData state with the new data
      setDogData(updatedDogData)
      setOriginalNotes(notes);
      setShowSaveButton(false);
    };
  
    // Invoke the helper function
    saveChangesAsync().catch(error => {
      console.error("Error saving changes:", error);
    });
  };
  

  const handleRowDoubleClick = (params) => {
    const eventData = params.row;
    setSelectedData(eventData);
    navigate("/create-event");
  };

  const handleDogUpdateClick = () => {
    setSelectedData(selectedRows[0]);
    navigate("/update-dog");
  };

  const handleClientUpdateClick = () => {
    let clientObject = {}
    clientObject.Name = selectedRows[0].ownerName;
    clientObject.Phone_Number = selectedRows[0].ownerNumber;
    clientObject.id = selectedRows[0].dogClientId;
    setSelectedData(clientObject);
    navigate("/update-client");
  };

  React.useEffect(() => {
    
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Query all the dogs and owners
        const dogs = await DataStore.query(Dog);
        const owners = await DataStore.query(Client);
        const events = await DataStore.query(Event);

        // Create lookup tables for faster lookups
        const ownerLookup = owners.reduce((acc, owner) => ({ ...acc, [owner.id]: owner }), {});
        const dogLookup = dogs.reduce((acc, dog) => ({ ...acc, [dog.id]: dog }), {});

        // Create a lookup for all events associated with each dog
        const dogEventsLookup = events.reduce((acc, event) => {
          if (!acc[event.eventDogId]) {
              acc[event.eventDogId] = [];
          }
          acc[event.eventDogId].push({
              date: event.Time_Start,
              type: event.Type,
              comments: event.Comments || "",
          });
          return acc;
        }, {});

        // Sort events chronologically for each dog
        for (let dogId in dogEventsLookup) {
          dogEventsLookup[dogId].sort((a, b) => new Date(a.date) - new Date(b.date));
        }
        
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
          return differenceInYears.toFixed(1);
        } 

        // Transform dogs to include related owner and most recent event data
        const combinedDogData = dogs.map(dog => {
          const relatedOwner = ownerLookup[dog.dogClientId];
          const dogEvents = dogEventsLookup[dog.id] || [];
          const dogAgeDisplay = dateDifferenceInYears(dog.Age);
          //const mostRecentEvent = mostRecentEventLookup[dog.id];
          //const mostRecentEventDate = mostRecentEvent ? new Date(mostRecentEvent.date).toISOString().split('T')[0] : "N/A";
          //const eventType = mostRecentEvent ? mostRecentEvent.type : "N/A";
          //const eventComments = mostRecentEvent ? mostRecentEvent.comments : "N/A";
          const eventDates = dogEvents.map(event => new Date(event.date).toISOString().split('T')[0]);
          const eventComments = dogEvents.map(event => event.comments);

          return {
            ...dog, // existing dog data
            ownerName: relatedOwner ? relatedOwner.Name : 'N/A', 
            ownerNumber: relatedOwner ? relatedOwner.Phone_Number : 'N/A',
            eventDates: eventDates, 
            eventComments: eventComments,
            dogAgeDisplay: dogAgeDisplay,
          };
        });

        // Transform events to include related dog and owner data
        const combinedEventData = events.map(event => {
          const relatedDog = dogLookup[event.eventDogId];
          const relatedOwner = ownerLookup[relatedDog ? relatedDog.dogClientId : null];

          const timeStart = new Date(event.Time_Start);
          const timeEnd = new Date(event.Time_End);

          const apptDate = `${timeStart.toLocaleString('en-US', { weekday: 'short' })}, ${timeStart.toLocaleString('en-US', { month: 'short' })} ${timeStart.getDate()}`;
          const timeStartString = timeStart.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
          const duration = Math.floor((timeEnd - timeStart) / (1000 * 60));  // Convert to minutes

          return {
            ...event,
            dogName: relatedDog ? relatedDog.Name : 'N/A',
            dogBreed: relatedDog ? relatedDog.Breed : 'N/A',
            dogAge: relatedDog ? relatedDog.Age : 'N/A',
            dogTemperament: relatedDog ? relatedDog.Temperament : 'N/A',
            dogComments: relatedDog ? relatedDog.Comments : 'N/A',
            dogPlannedFrequency: relatedDog ? relatedDog.Planned_Frequency : 'N/A',
            ownerName: relatedOwner ? relatedOwner.Name : 'N/A',
            ownerNumber: relatedOwner ? relatedOwner.Phone_Number : 'N/A',
            apptDate: apptDate, // New column
            timeStart: timeStartString, // New column
            duration: `${duration} mins` // New column
          };
        });

        // Finally, set the state variables
        setDogData(combinedDogData);
        setEventData(combinedEventData);

      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const dogColumns = [
    { field: 'Name', headerName: 'Dog Name', minWidth: 140 },
    { field: 'Breed', headerName: 'Breed', width: 130 },
    { field: 'ownerName', headerName: 'Owner Name', width: 165 },
    { field: 'ownerNumber', headerName: 'Phone Number', width: 170 },
    { field: 'mostRecentEventDate', headerName: 'Last Appt.', width: 150 },
    { field: 'Planned_Frequency', headerName: 'Planned Frequency', width: 200 },
    { field: 'dogAgeDisplay', headerName: 'Age', width: 100 },
    { field: 'Temperment', headerName: 'Temperament', width: 160 },
    { field: 'Style', headerName: 'Style', width: 150 },
    { field: 'eventComments', headerName: 'Comments', width: 350 },
    {
      field: 'notesButton',
      headerName: 'Notes',
      sortable: false,
      renderCell: (params) => (
        <Button variant="contained" color="primary" className='data-action-link' onClick={() => handleOpen(params)}>
          Notes
        </Button>
      ),
    },
    // ... add more columns as needed
  ];
  const eventColumns = [
    { field: 'apptDate', headerName: 'Appt Date', minWidth: 140 },
    { field: 'timeStart', headerName: 'Appt. Start', minWidth: 140 },
    { field: 'duration', headerName: 'Duration', minWidth: 140 },
    { field: 'dogName', headerName: 'Dog Name', minWidth: 140 },
    { field: 'dogBreed', headerName: 'Breed', width: 130 },
    { field: 'dogStyle', headerName: 'Style', width: 150 },
    { field: 'dogAge', headerName: 'Age', width: 100 },
    { field: 'dogTemperment', headerName: 'Temperament', width: 160 },
    { field: 'ownerName', headerName: 'Owner Name', width: 165 },
    { field: 'ownerNumber', headerName: 'Phone Number', width: 170 },
    { field: 'mostRecentEventDate', headerName: 'Last Appt.', width: 150 },
    { field: 'Planned_Frequency', headerName: 'Planned Frequency', width: 200 },
    // ... add more columns as needed
  ];

  function CustomToolbar() {
    return (
      <GridToolbarContainer className='grid-toolbar-continer'>
        <Link to="/add-dog" className="data-action-link">Add Dog</Link>
        <Link to="/add-client" className="data-action-link">Add Client</Link>
        <button 
          className='data-action-link dog-view' 
          disabled={selectedRows.length === 0} 
          onClick={handleDogUpdateClick}
        >
          Edit Dog
        </button>
        <button 
          className='data-action-link dog-view' 
          disabled={selectedRows.length === 0} 
          onClick={handleClientUpdateClick}
        >
          Edit Client
        </button>
        
        <GridToolbarQuickFilter id='dataviewer-quick-filter' />
      </GridToolbarContainer>
    );
  }

  function ConfirmationModal() {
    return (
      <Dialog
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        className="notes-confirmation-modal"
      >
        <DialogTitle>Before you go...</DialogTitle>
        <DialogContent>
          Do you want to save your changes to notes?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDiscardAndClose}>
              Discard
          </Button>
          <Button onClick={handleSaveAndClose}>
              Save
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  function formatDate(isoDate) {
    const date = new Date(isoDate);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

  return (
    <div className="grid-container">
    {loading ? (
      <div className="loading-spinner">
          <CircularProgress />
        </div>
      ) : (
      <DataGrid 
        rows={dogData} 
        columns={dogColumns} 
        pageSize={10} 
        components={{
          Toolbar: CustomToolbar,
        }}
        onRowClick={(param) => {
          setSelectedRows([param.row]);
        }}
        onRowDoubleClick={handleRowDoubleClick}
      />
      )}
      <ConfirmationModal/>
      <Modal open={open} onClose={handleClose} style={{ outline: 'none' }}>
        <div className="modal-content">
          <Grid container justifyContent="space-between" className="modal-header">
            <Typography variant="h6">Dog</Typography>
            <Typography variant="h6">Breed</Typography>
            <Typography variant="h6">Style</Typography>
            <Typography variant="h6">Owner</Typography>
          </Grid>
          <Grid container justifyContent="space-between" className="modal-header-data">
            <Typography>{rowData?.Name}</Typography>
            <Typography>{rowData?.Breed}</Typography>
            <Typography>{rowData?.Style}</Typography>
            <Typography>{rowData?.ownerName}</Typography>
          </Grid>
          <Typography variant="h6" className="section-header">Notes</Typography>
          <div className="notes-section">
            <TextField
              multiline
              fullWidth
              value={notes}
              onChange={handleNotesChange}
              variant="outlined"
              sx={{"& fieldset": { border: 'none'},}}
              className="notes-text-field"
            />
          </div>
          <Typography variant="h6" className="section-header">Grooming record</Typography>
          <div className="grooming-record-section">
            {rowData?.eventDates?.map((eventDate, index) => {
              const [month, day, year] = formatDate(eventDate).split(' ');
              return (
                <div key={index} className="record-entry">
                  <span className="record-flag material-symbols-outlined">flag</span>
                  <span className="record-month">{month}</span>
                  <span className="record-day">{day.replace(',', '')},</span>
                  <span className="record-year">{year}:</span>
                  <span className="record-comment">{rowData?.eventComments[index]}</span>
                </div>
              );
            })}
          </div>
          {showSaveButton && (
            <Button variant="contained" color="primary" className="save-button data-action-link" onClick={handleSaveChanges}>
              Save changes
            </Button>
          )}
        </div>
      </Modal>
    </div>
  );
}

function App() {
  const [selectedData, setSelectedData] = useState();
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef();

  React.useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight + 10);
      }
    };
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  return (
      <Router>
        <DataContext.Provider value={{ selectedData, setSelectedData }}>
          <div className="app-container">
            {/* Header Wrapper */}
            <div className="header-wrapper", ref={headerRef}>
              {/* Header */}
              <div className="content-header">
                  The Wizard of Pawz
              </div>
              {/* Side Menu */}
              <SideMenu />
            </div>

              {/* Content */}
              <div className="content">
                  <Routes>
                      <Route path="/" element={<Calendar />} />
                      <Route path="/Dataviewer" element={<DataViewer />} />
                      <Route path="/add-client" element={<CreateClient />} />
                      <Route path="/add-dog" element={<CreateDog />} />
                      <Route path="/update-dog" element={<UpdateDog />} />
                      <Route path="/update-client" element={<UpdateClient />} />
                      <Route path="/create-event" element={<EventCreateForm />} />
                  </Routes>
              </div>
          </div>
        </DataContext.Provider>
      </Router>
  );
}

export {DataContext};
export default App;
