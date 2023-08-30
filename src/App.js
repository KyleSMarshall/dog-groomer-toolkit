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

        console.log(eventData);
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
        console.log(transformedEvents);
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
        const events = await DataStore.query(Event);
        const dogs = await DataStore.query(Dog);
        const owners = await DataStore.query(Client);

        // Create a lookup table for owners
        const ownerLookup = {};
        owners.forEach(owner => {
          ownerLookup[owner.id] = owner;
        });

        // Create a lookup table for dogs
        const dogLookup = {};
        dogs.forEach(dog => {
          dogLookup[dog.id] = dog;
        });
        
        // Transform events to include related dog and owner data
        const combinedData = events.map(event => {
          const relatedDog = dogLookup[event.eventDogId];
          const relatedOwner = ownerLookup[event.eventClientId];
          console.log(relatedOwner);
          return {
            ...event, // event data
            dogName: relatedDog.Name, // or any other dog fields you want
            ownerName: relatedOwner.Name, // or any other owner fields you want
            // ... add more fields as needed
          };
        });

        setEvents(combinedData);
        console.log(combinedData);

      } catch (error) {
        console.error("Error fetching events:", error);
      }
      
    }
    fetchEvents();
  }, []);

  const columns = [
    { field: 'eventName', headerName: 'Event', width: 150 }, // assuming events have a field called eventName
    { field: 'dogName', headerName: 'Dog Name', width: 150 },
    { field: 'ownerName', headerName: 'Owner Name', width: 150 },
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

              {/* Content */}
              <div className="content">
                  <Routes>
                      <Route path="/" element={<Calendar />} />
                      <Route path="/Dataviewer" element={<DataViewer />} />
                      <Route path="/add-dog" element={<DogCreateForm />} />
                      <Route path="/add-client" element={<ClientCreateForm />} />
                  </Routes>
              </div>
          </div>
      </Router>
  );
}


export default App;