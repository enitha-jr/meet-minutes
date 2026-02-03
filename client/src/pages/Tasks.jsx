import React from 'react'
import Nav3 from '../components/Nav3'
import { Outlet } from 'react-router-dom'

function Tasks() {
  return (
    <div className='meeting-container'>
      <div className='nav-container'>
        <Nav3 />
      </div>
      <div className='main-content'>
        <Outlet />
      </div>
    </div>
  )
}

export default Tasks