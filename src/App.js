import './App.css';
import React, { useRef } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, useLocation } from 'react-router-dom';
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
import { Button } from '@mui/material';
import './DataViewer.css'


function Calendar() {
  const calendarRef = useRef(null);
  const [events, setEvents] = React.useState([]);

  React.useEffect(() => {
    
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
          const client = clientLookup[event.eventClientId];

          const dogName = dog ? dog.Name : "";
          const dogBreed = dog ? dog.Breed : "";
          const clientName = client ? client.Name : "";
          const clientPhoneNumber = client ? client.Phone_Number : "";

          const title = `Dog: ${dogName} - ${dogBreed}\nOwner: ${clientName} - ${clientPhoneNumber}`;

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
  const [events, setEvents] = React.useState([]);

  React.useEffect(() => {
    
    const fetchEvents = async () => {
      try {
        // Query all the dogs and owners
        const dogs = await DataStore.query(Dog);
        const owners = await DataStore.query(Client);
        const events = await DataStore.query(Event);

        // Create lookup tables for faster lookups
        const ownerLookup = owners.reduce((acc, owner) => ({ ...acc, [owner.id]: owner }), {});

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
        const combinedData = dogs.map(dog => {
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

        console.log(combinedData);
        setEvents(combinedData); // Assuming you'll change the state variable name to something more appropriate like setDogs



      } catch (error) {
        console.error("Error fetching events:", error);
      }
      
    }
    fetchEvents();
  }, []);

  const columns = [
    { field: 'Name', headerName: 'Dog Name', width: 150 },
    { field: 'Breed', headerName: 'Breed', width: 150 },
    { field: 'ownerName', headerName: 'Owner Name', width: 150 },
    { field: 'ownerNumber', headerName: 'Phone Number', width: 150 },
    { field: 'mostRecentEventDate', headerName: 'Last Appointment', width: 150 },
    { field: 'Planned_Frequency', headerName: 'Planned Frequency', width: 150 },
    { field: 'Age', headerName: 'Age', width: 150 },
    { field: 'Temperment', headerName: 'Temperment', width: 150 },
    { field: 'Style', headerName: 'Style', width: 150 },
    { field: 'eventComments', headerName: 'Comments', width: 150 },
    // ... add more columns as needed
  ];

  function CustomToolbar() {
    return (
      <GridToolbarContainer className='grid-toolbar-continer'>
        <Link to="/add-dog" className="data-action-link">Add Dog</Link>
        <Link to="/add-client" className="data-action-link">Add Client</Link>
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }

  return (
    <div className="grid-container">
      <DataGrid 
        rows={events} 
        columns={columns} 
        pageSize={10} 
        components={{
          Toolbar: CustomToolbar,
        }}
      />
    </div>
  );
}

function App() {
  return (
      <Router>
          <div className="app-container">
              {/* Side Menu */}
              <SideMenu />

              {/* Content Wrapper */}
              <div className="content-wrapper">
                  {/* Header */}
                  <div className="content-header">
                      The Wizard of Pawz
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
          </div>
      </Router>
  );
}


export default App;