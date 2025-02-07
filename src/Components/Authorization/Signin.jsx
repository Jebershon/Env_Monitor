import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signin.css';
import { ArrowBack } from '@mui/icons-material';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();

  const validateForm = () => {
    let isValid = true;
    toast.dismiss(); // Clear any existing error messages before validating

    if (!email) {
      toast.error('Please enter your email.');
      isValid = false;
    }

    if (!password) {
      toast.error('Please enter your password.');
      isValid = false;
    }

    return isValid;
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setTimeout(() => {
        window.location.reload();
        }, 100);
      return;
    }

    try {
      const response = await fetch('https://env-monitor-server.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        // Show success toast and then navigate after a delay
        toast.success('Login successful!', { transition: Bounce, autoClose: 2000 });

        // Delay navigation to allow the toast message to be visible
        setTimeout(() => {
          nav('/');
        }, 2500); // 2500ms delay to ensure the toast is shown before redirecting
      } else {
        toast.error('Login failed: ' + data.message);
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Please try again. Provide Correct Credentials');
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    }
  };


  return (
    <div>
      <ToastContainer />
      <button onClick={() => { nav('/') }} className='back-btn'>
        <span className='back-arrow'><ArrowBack /></span>Back
      </button>
      <div className='bg'>
        <form className="form" onSubmit={handleLogin}>
          <p className="form-title">Sign in to your account</p>
          <div className="input-container">
            <input
              placeholder="Enter email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span>
              <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"></path>
              </svg>
            </span>
          </div>
          <div className="input-container">
            <input
              placeholder="Enter password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span  onClick={() => setShowPassword(!showPassword)}>
              <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"></path>
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"></path>
              </svg>
            </span>
          </div>
          <button className="submit" type="submit">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signin;
