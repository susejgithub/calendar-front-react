/* eslint-disable react/prop-types */


export const CalendarEvent = (props) => {
  console.log('props: ' + props);

    const {event } = props;
    const {title, user } = event;
 
  return (
    <>
        <strong>{title}</strong>
        <span>- {user.name}</span>
    </>
  )
}
