import React from 'react'
import "../styles/Nav1.css"
import { NavLink } from 'react-router-dom'

const Nav1 = () => {
  return (
    <div className="navbar1">
        <NavLink to='/meetings/upcoming'>
          <div className="nav1-button">
            Upcoming
          </div>
        </NavLink>
        <NavLink to='/meetings/completed'>
          <div className="nav1-button">
            Completed
          </div>
        </NavLink>
        <NavLink to='/meetings/mymeeting'>
          <div className="nav1-button">
            My meeetings
          </div>
        </NavLink>
    </div>
  )
}

export default Nav1 