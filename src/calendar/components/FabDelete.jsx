import { useCalendarStor } from "../../hooks/useCalendarStor";


export const FabDelete = () => {
 const {startDeleteEvent, hasEventSelected} =useCalendarStor();

        const handleDelete = () =>{
          startDeleteEvent();
        }
            

  return (
    <button
    onClick={handleDelete}
    className="btn btn-danger fab-danger"
    style={{
      display: hasEventSelected ?  '' : 'none' 
    }}
    >
        <i className="fas fa-trash-alt"></i>

    </button>
  )
}
