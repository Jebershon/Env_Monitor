import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Error from '../Functional_Layout/Error404';
import './Signin.css';
import { ArrowBack } from '@mui/icons-material';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import Loader from '../Functional_Layout/loader';
function Profile() {
  const nav = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState({});
  useEffect(() => {
    const local = localStorage.getItem('token');
    if (local) {
      try {
        const decoded = jwtDecode(local);
        setIsAuthenticated(true);
        setToken(decoded);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone:'',
    password: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

useEffect(() => {
  if (token.id) {
    axios.get(`https://env-monitor-server.onrender.com/users/${token.id}`)
      .then(response => {
        const userData = response.data;
        setProfile({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          password: userData.password || '********'
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching profile information:', err);
        setError('Failed to load profile information');
        setLoading(false);
      });
  }
}, [token]);

  if (loading) {
    return (
      <>
      <div><Loader/></div>
      </>
    );
  }

  if (error) {
    return <div>
      <div>
      <button onClick={()=>{nav('/')}} className='back-btn'><span className='back-arrow'><ArrowBack></ArrowBack></span>Back</button>
      </div>
      {error}</div>;
  }

  return (
    <>
    {isAuthenticated && (
    <>
    <div>
    <button onClick={()=>{nav('/')}} className='back-btn'><span className='back-arrow'><ArrowBack></ArrowBack></span>Back</button>
      <div className='bg'>
        <form className="form">
          <p className="form-title">Profile</p>
          
          <div className="input-container">
            <input
              type="text"
              value={profile.name}
              readOnly
            />
            <span>
              <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"></path>
              </svg>
            </span>
          </div>

          <div className="input-container">
            <input
              type="text"
              value={profile.phone}
              readOnly
            />
            <span>
              <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"></path>
              </svg>
            </span>
          </div>

          <div className="input-container">
            <input
              type="email"
              value={profile.email}
              readOnly
            />
            <span>
              <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"></path>
              </svg>
            </span>
          </div>

          <div className="input-container">
            <input
              type="text"
              value={profile.password}
              readOnly
            />
            <span>
              <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"></path>
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"></path>
              </svg>
            </span>
          </div>
        </form>
      </div>
      <div class="label">
        <section class="label-top">
          <div class="label-top-text">PARENTAL</div>
        </section>
        <section class="label-middle">
          <div class="label-middle-text">ADVISORY</div>
        </section>
        <section class="label-bottom">
          <div class="label-bottom-text">EXPLICIT CONTENT</div>
        </section>
      </div>
    </div>
    </>
    )}
    {!isAuthenticated && (
      <>
      <Error/>
      </>
    )}
    </>
  );
}

export default Profile;
