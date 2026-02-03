import React from 'react'
import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import '../styles/Nav1.css'
import services from '../services/services'

const Nav2 = ({ meetingid }) => {
    const userData = useSelector((state) => state.auth);
    const [meetingdetails, setMeetingdetails] = useState([]);
    // console.log(userData.username);
    // console.log(userData.user_id + "  " + meetingdetails?.host?.user_id);
    useEffect(() => {
        const fetchMeetingDetails = async () => {
            const data = await services.getMeetingById(meetingid);
            // console.log(data);
            setMeetingdetails(data);
        }
        fetchMeetingDetails();
    }, [meetingid]);

    return (
        <div className="navbar1">
            <NavLink to={`/meeting/${meetingid}/details`}>
                <div className="nav1-button">
                    Details
                </div>
            </NavLink>
            {
                meetingdetails.followup === "yes" &&
                meetingdetails?.host?.user_id === userData.user_id && (
                    <NavLink to={`/meeting/${meetingid}/tobediscussed`}>
                        <div className="nav1-button">
                            To be Discussed
                        </div>
                    </NavLink>
                )
            }

            <NavLink to={'/meeting/' + meetingid + '/minutes'}>
                <div className="nav1-button">
                    Minutes
                </div>
            </NavLink>
            <NavLink to={`/meeting/${meetingid}/tasks`}>
                <div className="nav1-button">
                    Tasks
                </div>
            </NavLink>
            {
                (
                    userData?.user_id === meetingdetails?.host?.user_id ||
                    userData?.user_id === meetingdetails?.minutetaker?.user_id
                ) && (
                    <>
                        <NavLink to={`/meeting/${meetingid}/attendance`}>
                            <div className="nav1-button">
                                Attendance
                            </div>
                        </NavLink>
                        <NavLink to={`/meeting/${meetingid}/report`}>
                            <div className="nav1-button">
                                Report
                            </div>
                        </NavLink>
                    </>
                )
            }
            <NavLink to={`/meeting/${meetingid}/chat`}>
                <div className="nav1-button">
                    ROOM
                </div>
            </NavLink>
        </div>
    )
}

export default Nav2 