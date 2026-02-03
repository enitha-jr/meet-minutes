import React, { useState } from 'react';
import { Link, useNavigate, useParams, useOutletContext } from 'react-router-dom';
import "../../styles/Details.css";
import { FiEdit } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import meetServices from '../../services/meetServices';

const MeetDetails = () => {
    const { meetingid } = useParams();
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth);
    const { meetingdetails, setMeetingdetails } = useOutletContext();

    const handleFollowUp = () => {
        navigate('/newmeeting', { state: { followup: 'yes', meetingdetails } });
    };

    const handleComplete = async () => {
        try {
            await meetServices.completeMeeting(meetingid);
            setMeetingdetails((prev) => ({ ...prev, status: 'completed' }));
            navigate('/meetings');
        } catch (error) {
            console.error('Error completing meeting:', error);
        }
    };

    const togglePopup = () => setShowForm(!showForm);

    const hostName = meetingdetails?.host?.username || meetingdetails?.host || 'N/A';
    const minuteTakerName = meetingdetails?.minutetaker?.username || meetingdetails?.minutetaker || 'N/A';

    return (
        <div className="details-content">
            <div className="details-handlers">
                {userData?.user_id === meetingdetails?.host?.user_id && meetingdetails?.status !== 'completed' && (
                    <Link to={`/updatemeetingdetails/${meetingdetails.meetingid}`}>
                        <button>EDIT <FiEdit /></button>
                    </Link>
                )}
            </div>

            <div className="details-card">
                <div className="detail-item">
                    <div className="detail-item-left">
                        <div><span>Title:</span> {meetingdetails?.title || 'N/A'}</div>
                        <div><span>Host:</span> {hostName}</div>
                        <div><span>Date:</span> {meetingdetails?.date || 'N/A'}</div>
                        <div><span>Time:</span> {meetingdetails?.time || 'N/A'}</div>
                        {meetingdetails?.mode === 'online' ? (
                            <>
                                <div><span>Mode:</span> Online </div>
                                <div><span>Link:</span> 
                                    {meetingdetails?.meet_link ? (
                                        <a href={meetingdetails.meet_link} target="_blank" rel="noopener noreferrer">
                                            {meetingdetails.meet_link}
                                        </a>
                                    ) : 'N/A'}
                                </div>
                            </>
                        ) : (
                            <>
                                <div><span>Mode:</span> Offline </div>
                                <div><span>Venue:</span> {meetingdetails?.venue || 'N/A'}</div>
                            </>
                        )}
                    </div>

                    <div className="detail-item-right">

                        <div>
                            <span>Description:</span>
                            <div className="scroll-description">
                                {meetingdetails?.description || 'No Description'}
                            </div>
                        </div>

                        <div><span>Minute Taker:</span> {minuteTakerName}</div>

                        <div>
                            <span>Members:</span>
                            <div className="scroll-members">
                                {Array.isArray(meetingdetails?.members) && meetingdetails.members.length > 0 ? (
                                    meetingdetails.members.map((member, index) => (
                                        <div key={index}>
                                            {member.username} ({(member.email)})
                                        </div>
                                    ))
                                ) : (
                                    <div>No Members</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {userData?.user_id === meetingdetails?.host?.user_id && (
                <div className="action-buttons">
                    {meetingdetails?.status !== 'completed' && (
                        <button className="end-meeting-btn" onClick={togglePopup}>
                            END THE MEETING
                        </button>
                    )}
                    <button className="follow-up-btn" onClick={handleFollowUp}>
                        FOLLOW UP
                    </button>
                </div>
            )}

            {showForm && (
                <div className="task-form-content">
                    <div className="overlay" onClick={togglePopup}></div>
                    <div className="popup-container">
                        <div className="head4">
                            <h4>Are you sure you want to end the meeting?</h4>
                        </div>
                        <div className="popup-buttons">
                            <button className="popup-close" onClick={togglePopup}>
                                Close
                            </button>
                            <button className="popup-confirm" onClick={handleComplete}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MeetDetails;
