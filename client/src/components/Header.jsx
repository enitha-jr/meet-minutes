import React, { useState } from 'react'
import { FaRegCircleUser } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { setAuth , clearAuth } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import '../styles/Template.css'

const Header = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [showDropdown, setshowDropdown] = useState(false);

    const userData = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(clearAuth());
        navigate('/');
    };

    const handleDropdown = () => {
        setshowDropdown(!showDropdown);
    }
    return (
        <div className="header">
            <div className="head-container">
                <div className="name-container">
                    <div className="name">HELLO, {userData?.username?.toUpperCase()}</div>
                </div>
                <div className="dropdown-container">
                    <FaRegCircleUser className="user-icon" size={25} onClick={handleDropdown} />
                    {showDropdown &&
                        <div className="dropdown-menu">
                            <ul>
                                <li>Profile</li>
                                <li>Settings</li>
                                <li onClick={handleLogout} >Logout</li>
                            </ul>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Header