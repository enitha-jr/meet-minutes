import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/UpdateMinutes.css'
import { TiArrowBack } from "react-icons/ti";
import { Link } from 'react-router-dom';
import meetServices from '../../services/meetServices';

const UpdateMinutes = () => {
    const { meetingid, minuteid } = useParams(); // Combine both params
    const [note, setNote] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMinute = async () => {
            try {
                const data = await meetServices.getSingleMinute(meetingid, minuteid);
                setNote(data.minute);
            }
            catch (error) {
                console.error("Error fetching minute:", error);
            }
        }
        fetchMinute();
    }, [minuteid])

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        try {
            const response = await meetServices.updateMinute(meetingid, minuteid, { minute: note });
            // console.log(response);
            if(response) navigate(`/meeting/${meetingid}/minutes`);
        }
        catch (error) {
            console.error("Error updating minute");
        }
    }

    return (
        <div className="minute-update-content">
            <div className='update-minutes-header'><h3>UPDATE-MINUTE</h3></div>
            <div className="minute-update-input">
                <Link to={`/meeting/${meetingid}/minutes`}><TiArrowBack color="#055aba" className='back-button' size={40} /></Link>
                <form className="minute-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={note}
                        placeholder="Enter minutes"
                        onChange={(e) => setNote(e.target.value)}
                        required
                    />
                    <button type="submit" className="minute-update">Update</button>
                </form>
            </div>

        </div>
    );
};

export default UpdateMinutes;
