import React from 'react'
import Login from '../components/Login'
import SignUp from '../components/SignUp'
import { useLocation } from 'react-router-dom'


function Hero() {
  const location = useLocation();
  return (
    <div>
        {location.pathname === '/login' && <Login />}
        {location.pathname === '/signup' && <SignUp />}
    </div>
  )
}

export default Hero