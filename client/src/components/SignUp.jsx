import React, { useState } from 'react';
import '../styles/Login.css'; // reuse same css
import { useNavigate } from 'react-router-dom';
import authServices from '../services/authService';

function SignUp() {

  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: '',
    username: '',
    password: '',
    role: 'user'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await authServices.signup(loginData);

    if (response) {
      navigate('/login');
    } else {
      alert('Signup failed');
    }
  };

  return (
    <div className="login-container">

      <form className="login-form" onSubmit={handleSubmit}>

        <h2 className="login-title">Create Account</h2>

        {/* Email */}
        <div className="login-input-group">
          <label>Email</label>
          <input
            className="login-input"
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Username */}
        <div className="login-input-group">
          <label>Username</label>
          <input
            className="login-input"
            type="text"
            name="username"
            value={loginData.username}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="login-input-group">
          <label>Password</label>
          <input
            className="login-input"
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="login-button">
          Create Account
        </button>

        <p className="signup">
          Already have an account?{" "}
          <a onClick={() => navigate('/login')}>Log In</a>
        </p>

      </form>

    </div>
  );
}

export default SignUp;
