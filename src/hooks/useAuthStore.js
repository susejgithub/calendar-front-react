import { useDispatch, useSelector } from "react-redux"
import { calendarApi } from "../api";
import { onChecking, onClearErrorMessage, onLogin, onLogout } from "../store/auth/authSlice";
import { onLogoutCalendar } from "../store/calendar/calendarSlice";


export const useAuthStore = () => {

    const {status, user, errorMessage} = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const startLogin = async ({email, password})=>{
        dispatch(onChecking());
        console.log({email, password});

       try {
            const {data} = await calendarApi.post('/auth', {email, password});
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch(onLogin({name: data.name, uid:data.uid} ));


       } catch (error) {
        console.log({error});
        dispatch(onLogout('Error de credenciales'));

        setTimeout(() => {
            dispatch(onClearErrorMessage());
        }, 10);
       }
    }


    const startRegister = async ({name, email, password})=>{
        dispatch(onChecking());
        console.log({name, email, password});

       try {
            const {data} = await calendarApi.post('/auth/new', {name, email, password});
            console.log(data)
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch(onLogin({name: data.name, uid:data.uid} ));


       } catch (error) {
        
        dispatch(onLogout(error.response.data?.msg || '--'));

        setTimeout(() => {
            dispatch(onClearErrorMessage());
        }, 10);
       }
    }

    const checkAuthToken = async ()=>{

      console.log('en checkAuthToken');
      
      const token = localStorage.getItem('token');

      console.log('Token' + token);

      if( !token ) return dispatch(onLogout());

      try {

        const {data} = await calendarApi.get('auth/renew');
        localStorage.setItem('token', data.token);
        localStorage.setItem('token-init-date', new Date().getTime());
        dispatch(onLogin({name: data.name, uid:data.uid} ));
        
      } catch (error) {
        console.log(error);
        localStorage.clear();
        dispatch(onLogout());
      }


    }

    const startLogout = () => {
      localStorage.clear();
      dispatch(onLogoutCalendar());
      dispatch(onLogout());
    }



  return {
    //Propiedades
    status, 
    user, 
    errorMessage,


    //Metodos
    startLogin,
    startRegister,
    checkAuthToken,
    startLogout,


  }
}
