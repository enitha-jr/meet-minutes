import React from 'react'
import '../styles/Nav1.css'
import { NavLink } from 'react-router-dom'

const Nav3 = () => {
  return (
    <div className="navbar1">
        <NavLink to='/tasks/mytasks'>
          <div className="nav1-button">
            My Tasks
          </div>    
        </NavLink>
        <NavLink to='/tasks/assignedtasks'>
          <div className="nav1-button">
            Assigned
          </div>
        </NavLink>
    </div>
  )
}

export default Nav3 