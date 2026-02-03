import React from 'react'
import '../styles/Login.css'
import { useNavigate } from 'react-router-dom'
import authServices from '../services/authService'
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { setAuth } from '../store/authSlice';

function SignUp() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const redirectLogIn = () => {
        navigate('/login');
    }

    const [loginData, setLoginData] = useState({
        email: '',
        username: '',
        password: '',
        role: 'user'
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log('Form Data:', loginData);
        const response = await authServices.signup(loginData);
        if (response) {
            navigate('/login');
        } else {
            console.error('SignUp failed');
        }
    }

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-title">Sign Up</h2>
                <div className="login-input-group">
                    <label>Email</label>
                    <input
                        className="login-input"
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={loginData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="login-input-group">
                    <label>Username</label>
                    <input
                        className="login-input"
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={loginData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="login-input-group">
                    <label>Password</label>
                    <input
                        className="login-input"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={loginData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="login-button">
                    Create Account
                </button>
                <p className="signup">
                    Have an account? <a onClick={redirectLogIn}>Log In</a>
                </p>
            </form>
        </div>
    )
}

export default SignUp
