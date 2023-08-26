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
  DogUpdateForm 
} from './ui-components';


import {Amplify, DataStore} from 'aws-amplify';
import { Event, Client, Dog } from './models';
import awsConfig from './aws-exports';

function Calendar() {
  const calendarRef = useRef(null);
  const [events, setEvents] = React.useState([]);

  Amplify.configure(awsConfig);

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventData = await DataStore.query(Client);
        console.log(eventData);
        //setEvents(eventData.data.listEvents.items);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }
    fetchEvents();
  }, []);

  const handleDateClick = (arg) => {
    if (arg.view.type === 'dayGridMonth') {;
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
      weekends={false}
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
    />
  );
}

function MyCalendarComponent() {
  return <Calendar />;
  //return <DogCreateForm/>
}

export default MyCalendarComponent;
