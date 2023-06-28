import { CalendarEvent, CalendarModal, FabAddNew, FabDelete, Navbar } from "../"

import { Calendar } from 'react-big-calendar'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import { localizer, getMessagesES } from "../../helpers"
import { useEffect, useState } from "react"
import { useUiStore } from "../../hooks/useUiStore"
import { useCalendarStor } from "../../hooks/useCalendarStor"
import { useAuthStore } from "../../hooks/useAuthStore"






export const CalendarPage = () => {
  
  const {user} = useAuthStore();

  const {openDateModal} = useUiStore();

  const {events, setActiveEvent, startLoadingEvents} = useCalendarStor();

 

  const [lastView, setlastView] = useState(localStorage.getItem('lastView' )|| 'month');


  const eventStyleGetter = (event, start, end, isSelected) =>{

    console.log(event, start, end, isSelected);

    const isMyEvent = (user.uid === event.user._id ) || (user.uid === event.user.uid )

    const style = {
      backgroundColor: isMyEvent ?  '#347CF7' : '#465660',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white'
    }

    return {
      style
    }
  }

  useEffect(() => {
    startLoadingEvents()
  
    
  }, [])
  

  const onDoubleClick = ()=>{
    // console.log( {doubleClick: event});
    openDateModal();
  }
  const onSelect = (event)=>{
    console.log({click: event});
    setActiveEvent(event);
  }
  const onVieChanged = (event)=>{
    console.log({viewChanged:event});
    localStorage.setItem("lastView", event);
    setlastView(event);
  }

  return (
   <>

    <Navbar/>

    <Calendar
    culture="es"
      localizer={localizer}
      events={events}
      defaultView={lastView}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 'calc(100vh - 80px)' }}
      messages={getMessagesES()}
      eventPropGetter={eventStyleGetter}
      components={{
        event: CalendarEvent
      }}
      onDoubleClickEvent={onDoubleClick}
      onSelectEvent={onSelect}
      onView={onVieChanged}
    />

    <CalendarModal></CalendarModal>
    <FabAddNew/>
      <FabDelete/>

   
   </>
  )
}
