import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import '../styles/Template.css'
import { Outlet } from 'react-router-dom'

function Template() {
  return (
    <div className='template'>
      <Sidebar />
      <div className='anti-sidebar'>
        <Header />
        <div className="outlet-container">
          <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default Template