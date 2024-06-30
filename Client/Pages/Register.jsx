import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CompleteRegistration from '../components/CompleteRegistration';
import '../css/Forms.css'

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordVerify: '',
  });

  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.passwordVerify) {
      console.log('Passwords do not match');
      return;
    }

    fetch(`http://localhost:3000/users?username=${formData.username}`)
      .then(res => res.json())
      .then(user => {
        if (user[0] == null) {
          setIsRegistered(true);
        }
        else {
          alert('Registration failed');
          navigate('/login');
        }
      })

  };

  return (
    <div className='container'>
      {isRegistered ? <CompleteRegistration /> :
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Username:
            <input type="text" name="username" value={formData.username} onChange={handleInputChange} />
          </label>
          <br />
          <label>
            Password:
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} />
          </label>
          <br />
          <label>
            Verify Password:
            <input type="password" name="passwordVerify" value={formData.passwordVerify} onChange={handleInputChange} />
          </label>
          <br />
          <button type="submit">Register</button>
        </form>
      }
    </div >
  );
}

export default Register;





