import { addHours } from "date-fns";
import { useCalendarStor } from "../../hooks/useCalendarStor";
import { useUiStore } from "../../hooks/useUiStore"


export const FabAddNew = () => {

        const {openDateModal} = useUiStore();
        const {setActiveEvent} =useCalendarStor();

        const handleClicNew = () =>{
            setActiveEvent({
                title: '',
                notes: '',
                start: new Date(),
                end: addHours(new Date(), 2),
                user: {
                  _id:123,
                  name:'Jesus'
                }
              });
            openDateModal();
        }

  return (
    <button
    onClick={handleClicNew}
    className="btn btn-primary fab"
    >
        <i className="fas fa-plus"></i>

    </button>
  )
}
