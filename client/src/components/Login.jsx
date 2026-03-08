import React from 'react'
import '../styles/Login.css'
import { useNavigate } from 'react-router-dom'
import authServices from '../services/authService'
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { setAuth } from '../store/authSlice';
import { connectSocket } from '../socketio/connectSocket';

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const redirectSignUp = () => {
        navigate('/signup');
    }

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
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

        // Standalone demo login for deployment.
        if (
            loginData.email === "test@.gmailcom" &&
            loginData.password === "asdfg"
        ) {
            const demoUser = {
                token: "demo-token-123",
                user_id: 1,
                username: "test1",
                email: "test1@gmail.com.com",
                exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
            };

            dispatch(setAuth(demoUser));
            navigate("/meetings");
            return;
        }

        const response = await authServices.login(loginData);
        if (response) {
            // console.log('Login successful:', response);
            dispatch(setAuth(response));
            connectSocket(response.token);
            navigate('/meetings');
        } else {
            alert('Login failed. Please check your credentials.');
            console.error('Login failed');
        }
    }

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-title">Log In</h2>
                
                <div style={{
                    backgroundColor: '#e3f2fd',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: '1px solid #2196f3'
                }}>
                    <p style={{ margin: 0, fontSize: '14px', color: '#1976d2' }}>
                        <strong>Demo Mode:</strong> Login with email: <code>test1@example.com</code> and password: <code>test1</code>
                    </p>
                </div>

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
                    Log In
                </button>

                <p className="forgot-password">Forgot password?</p>
                <p className="signup">
                    Don't have an account? <a onClick={redirectSignUp}>Sign Up</a>
                </p>
            </form>
        </div>
    )
}

export default Login