import { useDispatch, useSelector } from "react-redux";
import { onDeleteEvent, onLoadEvents, onSetActiveevent, onUpdateEvent, onaddNewEvent } from "../store/calendar/calendarSlice";
import calendarApi from "../api/calendarApi";
import { convertEventsToDateEvents } from "../helpers";
import Swal from "sweetalert2";


export const useCalendarStor = () => {
 
    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector(state => state.calendar);
    const { user } = useSelector(state => state.auth);

    const setActiveEvent = (calendarEvent) =>{
        dispatch(onSetActiveevent(calendarEvent));
    }

    const startSavingEvent = async (calendarEvent) => {


        try {

            if(calendarEvent.id){
                await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent);
    
               dispatch( onUpdateEvent({...calendarEvent, user}));
               return;
            } 
    
                const {data} = await calendarApi.post('/events', calendarEvent);
                // console.log(data);
                dispatch( onaddNewEvent({...calendarEvent, id: data.evento.id, user}))

            
        } catch (error) {
            console.log(error);
            Swal.fire('Error al guardar', error.response.data.msg, 'error')
        }

        
        

    }

    const startDeleteEvent = async() =>{
        try {

            console.log({activeEvent})

            // if(calendarEvent.id){
                await calendarApi.delete(`/events/${activeEvent.id}`);
    
                dispatch(onDeleteEvent());
            //    return;
            // } 
    
              

            
        } catch (error) {
            console.log(error);
            Swal.fire('Error al eliminar', error.response.data.msg, 'error')
        }
       

    }

    const startLoadingEvents = async () => {

        try {
            
            const {data} = await calendarApi.get('/events');
            const events = convertEventsToDateEvents(data.eventos);
            dispatch(onLoadEvents(events));

            console.log({events})
        } catch (error) {
            console.log('Error cargando eventos');
            console.log(error);
        }
    }

    return {
        // Propiedades
        events,
        activeEvent,
        hasEventSelected: !!activeEvent,


        //Metodos
        setActiveEvent,
        startSavingEvent,
        startDeleteEvent,
        startLoadingEvents,


    }
}
