import { addHours, differenceInSeconds } from "date-fns";
import { useEffect, useState } from "react";
import Modal from "react-modal"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { registerLocale,} from  "react-datepicker";
import es from 'date-fns/locale/es';
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css'
import { useMemo } from "react";
import { useUiStore } from "../../hooks/useUiStore";
import { useCalendarStor } from "../../hooks/useCalendarStor";


registerLocale('es', es)



const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  Modal.setAppElement('#root');


export const CalendarModal = () => {

    const {closeDateModal} = useUiStore();

    const {isDateModalOpen} = useUiStore();

    // const [isOpen, setIsOpen] = useState(true);

    const {activeEvent, startSavingEvent} = useCalendarStor();

    const [formSubmitted, setformSubmitted] = useState(false)

    const [formValues, setformValues] = useState({
        title: '',
        notes: '',
        start: new Date(),
        end: addHours(new Date(), 2),

    });

    const tittleClass = useMemo(() => {
         if(!formSubmitted) return;

      
         return(formValues.title.length >0)
         ? ''
         : 'is-invalid';
    }, [formValues.title, formSubmitted]);


    useEffect(() => {
     if(activeEvent!==null){
        setformValues({...activeEvent})
     }
    }, [activeEvent])
    

    const onInputChange = ({target}) =>{
        setformValues({
            ...formValues,
            [target.name]: target.value
        })
    }

    const onDateChange = (event, changingType) =>{
        setformValues({
            ...formValues,
            [changingType]: event
        })
    }

    const onCloseModal = ()=> {
        // console.log("Cerrando Modal");
        closeDateModal();
        // setIsOpen(false);
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        setformSubmitted(true);

        const difference = differenceInSeconds(formValues.end, formValues.start);
        
        if( isNaN(difference) || difference <= 0 ){
            Swal.fire('Fechas incorrectas', 'Revisar las Fechas', 'error');
            console.log('Error en fechas');
            return;
        }

        if(formValues.title.length <= 0){
           return; 
        }

        console.log(formValues);

        await startSavingEvent(formValues);
        closeDateModal();
        setformSubmitted(false);
    }
  return (
    <Modal
    isOpen={isDateModalOpen}
        onRequestClose={onCloseModal}
        style={customStyles}
        className="modal"
        overlayClassName="modal-fondo"
        closeTimeoutMS={200}
        >

<h1> Nuevo evento </h1>
<hr />
<form className="container" onSubmit={onSubmit}>

    <div className="form-group mb-2">
        <label>Fecha y hora inicio</label>
        <DatePicker selected={formValues.start} timeCaption="Hora" locale="es"  showTimeSelect onChange={ (event) => onDateChange(event, 'start')} dateFormat='Pp' className="form-control"></DatePicker>
    </div>

    <div className="form-group mb-2">
        <label>Fecha y hora fin</label>
        <DatePicker minDate={formValues.start} timeCaption="Hora" locale="es" showTimeSelect  selected={formValues.end} onChange={ (event) => onDateChange(event, 'end') } dateFormat='Pp' className="form-control"></DatePicker>
    </div>

    <hr />
    <div className="form-group mb-2">
        <label>Titulo y notas</label>
        <input 
            type="text" 
            className={`form-control ${tittleClass }`}
            placeholder="Título del evento"
            name="title"
            autoComplete="off"
            value={formValues.title}
            onChange={onInputChange}
        />
        <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
    </div>

    <div className="form-group mb-2">
        <textarea 
            type="text" 
            className="form-control"
            placeholder="Notas"
            rows="5"
            name="notes"
            value={formValues.notes}
            onChange={onInputChange}
        ></textarea>
        <small id="emailHelp" className="form-text text-muted">Información adicional</small>
    </div>

    <button
        type="submit"
        className="btn btn-outline-primary btn-block"
    >
        <i className="far fa-save"></i>
        <span> Guardar</span>
    </button>

</form>

    </Modal>
  )
}
