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
  EventCreateForm
} from './ui-components';


import {Amplify, DataStore} from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import { Event, Client, Dog } from './models';
import { DataGrid, GridToolbarContainer, GridSearchIcon, GridToolbarQuickFilter} from '@mui/x-data-grid';
import { Button, Modal, TextField, Grid, Typography, Divider } from '@mui/material';

import './DataViewer.css'

// // Function to adjust padding
// const adjustPadding = () => {
//   const header = document.querySelector('.header-wrapper');
//   const content = document.querySelector('.content');

//   if (header) {
//     const headerHeight = header.offsetHeight + 10;
//     // Set the padding top of the content to the height of the header
//     content.style.paddingTop = `${headerHeight}px`;
//   }
// };

// // Call the function once initially
// adjustPadding();

// // Adjust padding whenever the window is resized
// window.addEventListener('resize', adjustPadding);

const DataContext = React.createContext();

function Calendar() {
  const calendarRef = useRef(null);
  const [events, setEvents] = React.useState([]);

  React.useEffect(() => {

    // adjustPadding();
    // window.addEventListener('resize', adjustPadding);

    // // Cleanup
    // window.removeEventListener('resize', adjustPadding);
    
    const fetchEvents = async () => {
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

          const title = `Dog: ${dogName} - ${dogBreed}\nOwner: ${clientName} - ${clientPhoneNumber}\nAppt. Type: ${apptType}`;

          return {
              start: event.Time_Start,
              end: event.Time_End,
              title: title,
              id: event.id,
          };
        });
      
        setEvents(transformedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
      
    }
    fetchEvents();
  }, []);

  const handleDateClick = (arg) => {
    if (arg.view.type === 'dayGridMonth') {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView('timeGridDay', arg.date);
    }
  }

  return (
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
    />
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
  const [open, setOpen] = React.useState(false);
  const [rowData, setRowData] = React.useState(null);
  const [notes, setNotes] = React.useState('');
  const [showSaveButton, setShowSaveButton] = React.useState(false);

  
  const [activeView, setActiveView] = useState('dogs'); // default view is 'dogs'

  const [dogData, setDogData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const { setSelectedData } = React.useContext(DataContext);
  const navigate = useNavigate();

  const handleOpen = (params) => {
    setRowData(params.row);
    console.log(params.row);
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleNotesChange = (e) => {
    setNotes(e.target.value);
    setShowSaveButton(true);
  };
  
  const handleSaveChanges = () => {
    // Save the changes to the database
    setShowSaveButton(false);
  };
  

  const handleRowDoubleClick = (params) => {
    const eventData = params.row;
    setSelectedData(eventData);
    navigate("/create-event");
  };

  React.useEffect(() => {
    
    const fetchEvents = async () => {
      try {
        // Query all the dogs and owners
        const dogs = await DataStore.query(Dog);
        const owners = await DataStore.query(Client);
        const events = await DataStore.query(Event);

        // Create lookup tables for faster lookups
        const ownerLookup = owners.reduce((acc, owner) => ({ ...acc, [owner.id]: owner }), {});
        const dogLookup = dogs.reduce((acc, dog) => ({ ...acc, [dog.id]: dog }), {});

        // Create a lookup for the most recent event date, type, and comments for each dog
        const mostRecentEventLookup = events.reduce((acc, event) => {
          if (!acc[event.eventDogId] || new Date(acc[event.eventDogId].date) < new Date(event.Time_Start)) {
            acc[event.eventDogId] = {
              date: event.Time_Start,
              type: event.Type,
              comments: event.Comments,
            };
          }
          return acc;
        }, {});

        // Transform dogs to include related owner and most recent event data
        const combinedDogData = dogs.map(dog => {
          const relatedOwner = ownerLookup[dog.dogClientId];
          const mostRecentEvent = mostRecentEventLookup[dog.id];
          const mostRecentEventDate = mostRecentEvent ? new Date(mostRecentEvent.date).toISOString().split('T')[0] : "N/A";
          const eventType = mostRecentEvent ? mostRecentEvent.type : "N/A";
          const eventComments = mostRecentEvent ? mostRecentEvent.comments : "N/A";

          return {
            ...dog, // existing dog data
            ownerName: relatedOwner ? relatedOwner.Name : 'N/A', // Add owner name
            ownerNumber: relatedOwner ? relatedOwner.Phone_Number : 'N/A',
            mostRecentEventDate: mostRecentEventDate, // Most recent event date
            eventType: eventType, // Event type
            eventComments: eventComments, // Event comments
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
        console.log(combinedDogData);
        setEventData(combinedEventData);

      } catch (error) {
        console.error("Error fetching events:", error);
      }
      
    }
    fetchEvents();
  }, []);

  const dogColumns = [
    { field: 'Name', headerName: 'Dog Name', minWidth: 140 },
    { field: 'Breed', headerName: 'Breed', width: 130 },
    { field: 'ownerName', headerName: 'Owner Name', width: 165 },
    { field: 'ownerNumber', headerName: 'Phone Number', width: 170 },
    { field: 'mostRecentEventDate', headerName: 'Last Appt.', width: 150 },
    { field: 'Planned_Frequency', headerName: 'Planned Frequency', width: 200 },
    { field: 'Age', headerName: 'Age', width: 100 },
    { field: 'Temperment', headerName: 'Temperament', width: 160 },
    { field: 'Style', headerName: 'Style', width: 150 },
    { field: 'eventComments', headerName: 'Comments', width: 350 },
    {
      field: 'notesButton',
      headerName: 'Notes',
      sortable: false,
      renderCell: (params) => (
        <Button variant="contained" color="primary" onClick={() => handleOpen(params)}>
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
        <GridToolbarQuickFilter />
        <button onClick={() => setActiveView('dogs')}>View Dogs</button>
        <button onClick={() => setActiveView('events')}>View Events</button>
      </GridToolbarContainer>
    );
  }

  return (
    <div className="grid-container">
      {/* Conditional rendering based on activeView */}
      {activeView === 'dogs' && (
        <DataGrid 
          rows={dogData} 
          columns={dogColumns} 
          pageSize={10} 
          components={{
            Toolbar: CustomToolbar,
          }}
          onRowDoubleClick={handleRowDoubleClick}
        />
      )}
      {activeView === 'events' && (
        <DataGrid 
          rows={eventData} 
          columns={eventColumns} 
          pageSize={10} 
          components={{
            Toolbar: CustomToolbar,
          }}
          onRowDoubleClick={handleRowDoubleClick}
        />
      )}
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
          <Divider />
          <Typography variant="h6" className="section-header">Notes</Typography>
          <div className="notes-section">
            <TextField
              multiline
              fullWidth
              value={notes}
              onChange={handleNotesChange}
              variant="outlined"
              sx={{"& fieldset": { border: 'none'},}}
            />
          </div>
          <Divider />
          <Typography variant="h6" className="section-header">Grooming record</Typography>
          <div className="grooming-record-section">
            {rowData?.comments?.map((comment, index) => (
              <Typography key={index}>
                {/* Format the date and comment here */}
                {comment.date} : {comment.text}
              </Typography>
            ))}
          </div>
          {showSaveButton && (
            <Button variant="contained" color="primary" className="save-button" onClick={handleSaveChanges}>
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

  return (
      <Router>
        <DataContext.Provider value={{ selectedData, setSelectedData }}>
          <div className="app-container">
            {/* Header Wrapper */}
            <div className="header-wrapper">
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
                      <Route path="/add-client" element={<ClientCreateForm />} />
                      <Route path="/add-dog" element={<DogCreateForm />} />
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