import './App.css';
import React, { useRef } from 'react';
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
import awsConfig from './aws-exports';

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

          const dogName = dog ? dog.Name : "Unknown Dog";
          const dogBreed = dog ? dog.Breed : "Unknown Breed";
          const clientName = client ? client.Name : "Unknown Client";
          const clientPhoneNumber = client ? client.Phone_Number : "Unknown Number";

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

function MyCalendarComponent() {
  return <Calendar />;
  //return <EventCreateForm/>
}

export default MyCalendarComponent;
