import React, {useState} from 'react';
import "../css/login.css"
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../helpers/authContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const fetchData = async () => {
    try {
          if (!email.trim()) {
            toast.error('Email is required');
            return;
          }

          if (!password.trim()) {
            toast.error('Password is required');
            return;
          }

          const postData = {
            email: email,
            password: password
          };

          const response = await fetch('http://localhost:5002/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify(postData), 
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      console.log(result);
      login(result);
      if (result.account_type == "student") {
        navigate('/student-page');
      } else {
        navigate('/teacher-page');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Invalid email or password');
    } 
  };

  const handleClick = (e) => {
    e.preventDefault();
    fetchData();
  };

  //TODO de gestionat situatia in care login ul nu e corect (redirectionarea oricum nu se face, dar ar fi ok sa se afiseze ceva)
  return (
    <div className="Login">
      <div className="login-box">
        <h1>Login Page</h1>
        <form>
            <div>
                <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />

            </div>
            <div>
                <input 
                type="password" 
                id="parola" 
                name="parola" 
                required 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <input type="submit" value="Authentification" id="submit" onClick={handleClick} />
        </form>

      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
