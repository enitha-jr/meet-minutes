import React from 'react'
import Nav2 from '../../components/Nav2'
import { Outlet, useParams } from 'react-router-dom';
import services from '../../services/services';
import { useState , useEffect } from 'react';

function Meetinfo() {
    const { meetingid } = useParams();
    const [meetingdetails, setMeetingdetails] = useState({});

    useEffect(() => {
        const getMeetingById = async () => {
            try {
                const data = await services.getMeetingById(meetingid);
                if (data.date) {
                    data.date = String(data.date).split('T')[0]; // keep only YYYY-MM-DD
                }
                // console.log("Fetched Meeting Details:", data);
                setMeetingdetails(data);
            } catch (error) {
                console.error('Error fetching meeting details:', error);
            }
        };
        getMeetingById();
    }, [meetingid]);

    return (
        <div className='meetinfo-page'>
            <div className='nav-container'>
                <Nav2 meetingid={meetingid} />
            </div>
            <div className='main-content'>
                <Outlet context={{ meetingdetails , setMeetingdetails}} />
            </div>
        </div>
    )
}

export default Meetinfo