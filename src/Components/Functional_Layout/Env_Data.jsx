import './Env_Data.css';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import Error from '../Functional_Layout/Error404';
import {jwtDecode} from 'jwt-decode';
import { useState,useEffect } from 'react';
function Env_Data() {
  const nav = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAuthenticated(true);
        console.log(decoded);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);
    return (
      <>
      {isAuthenticated && (
        <>
        <button onClick={()=>{nav('/')}} className='back-btn'><span className='back-arrow'><ArrowBack></ArrowBack></span>Back</button>
        <div>rrr</div>
        </>
      )}
      {!isAuthenticated && (
      <Error/>
       )}
      </>
    );
  }
  
  export default Env_Data;