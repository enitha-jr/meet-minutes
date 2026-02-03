import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/Details.css";
import "../../styles/NewMeeting.css";
import { PiPlusCircleFill } from "react-icons/pi";
import services from "../../services/services";
import meetServices from "../../services/meetServices";

const UpdateMeetDetails = () => {
    const { meetingid } = useParams();
    const navigate = useNavigate();

    const [meetingdetails, setMeetingdetails] = useState({});
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [mode, setMode] = useState("");
    const [venue, setVenue] = useState("");
    const [meetLink, setMeetLink] = useState("");

    const [users, setUsers] = useState([]);
    const [minutetakerId, setMinutetakerId] = useState("");
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState("");

    useEffect(() => {
        const fetchMeetingDetails = async () => {
            try {
                const data = await services.getMeetingById(meetingid);
                setMeetingdetails(data);
                setTitle(data.title || "");
                setDesc(data.description || "");

                if (data.date) {
                    const isoDate = new Date(data.date);
                    const formattedDate = isoDate.toISOString().split("T")[0];
                    setDate(formattedDate);
                } else {
                    setDate("");
                }

                setTime(data.time || "");
                setMode(data.mode || "");
                setVenue(data.venue || "");
                setMeetLink(data.meet_link || "");
                setMinutetakerId(data.minute_taker_id || "");

                // Set members as objects (user_id, username, email)
                if (Array.isArray(data.members)) {
                    setMembers(
                        data.members.map((m) =>
                            typeof m === "object"
                                ? { user_id: m.user_id, username: m.username, email: m.email }
                                : { user_id: m, username: "", email: "" }
                        )
                    );
                }
            } catch (error) {
                console.error("Error fetching meeting details:", error);
            }
        };

        const fetchUsers = async () => {
            try {
                const data = await services.getUsers();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchMeetingDetails();
        fetchUsers();
    }, [meetingid]);

    const handleAddMember = () => {
        if (!selectedMember) return;
        const user = users.find((u) => u.user_id === parseInt(selectedMember));
        if (user && !members.some((m) => m.user_id === user.user_id)) {
            setMembers([...members, user]);
        }
        setSelectedMember("");
    };

    
    const handleRemoveMember = (id) => {
        setMembers(members.filter((m) => m.user_id !== id));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updated = {
                ...meetingdetails,
                title,
                description: desc,
                date,
                time,
                mode,
                venue,
                meet_link: meetLink,
                minute_taker_id: minutetakerId,
                members: members.map((m) => m.user_id), 
            };
            // console.log("Updated Meeting Data:", updated);
            await meetServices.updateMeeting(meetingid, updated);
            navigate(-1);
        } catch (error) {
            console.error("Error updating meeting:", error);
        }
    };

    const handleBack = () => navigate(-1);

    return (
        <div className="details-content">
            <form className="details-card newmeeting-form" onSubmit={handleUpdate}>
                <div className="detail-item two-column">
                    {/* ---------- LEFT COLUMN ---------- */}
                    <div className="detail-item-left">
                        <div className="form-group">
                            <label>Title:</label>
                            <input
                                className="input-field"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Date:</label>
                            <input
                                className="input-field"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Time:</label>
                            <input
                                className="input-field"
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Mode:</label>
                            <select
                                className="input-field"
                                value={mode}
                                onChange={(e) => setMode(e.target.value)}
                                required
                            >
                                <option value="">Select</option>
                                <option value="offline">Offline</option>
                                <option value="online">Online</option>
                            </select>
                        </div>

                        {mode === "online" ? (
                            <div className="form-group">
                                <label>Meet Link:</label>
                                <input
                                    className="input-field"
                                    type="text"
                                    value={meetLink}
                                    onChange={(e) => setMeetLink(e.target.value)}
                                    placeholder="Enter meeting link"
                                />
                            </div>
                        ) : (
                            <div className="form-group">
                                <label>Venue:</label>
                                <input
                                    className="input-field"
                                    type="text"
                                    value={venue}
                                    onChange={(e) => setVenue(e.target.value)}
                                    placeholder="WW101"
                                />
                            </div>
                        )}
                    </div>

                    {/* ---------- RIGHT COLUMN ---------- */}
                    <div className="detail-item-right">
                        <div className="form-group">
                            <label>Description:</label>
                            <textarea
                                className="scroll-description input-field"
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Minute Taker:</label>
                            <select
                                className="input-field"
                                value={minutetakerId || meetingdetails?.minutetaker?.user_id || ""}
                                onChange={(e) => setMinutetakerId(e.target.value)}
                                required
                            >
                                <option value="">
                                    {meetingdetails?.minutetaker?.username
                                        ? `${meetingdetails.minutetaker.username} (${meetingdetails.minutetaker.email})`
                                        : "Select Minute Taker"}
                                </option>
                                {users.map((user) => (
                                    <option key={user.user_id} value={user.user_id}>
                                        {user.username} ({user.email})
                                    </option>
                                ))}
                            </select>
                        </div>


                        {/* Add Member */}
                        <div className="form-group">
                            <label>Add Member:</label>
                            <div className="member-select">
                                <select
                                    className="input-field"
                                    value={selectedMember}
                                    onChange={(e) => setSelectedMember(e.target.value)}
                                >
                                    <option value="">Select Member</option>
                                    {users.map((user) => (
                                        <option key={user.user_id} value={user.user_id}>
                                            {user.username} ({user.email})
                                        </option>
                                    ))}
                                </select>
                                <PiPlusCircleFill
                                    className="add-icon"
                                    onClick={handleAddMember}
                                />
                            </div>
                        </div>

                        {/* Members List */}
                        <div className="members-list">
                            {members.length > 0 ? (
                                members.map((m) => (
                                    <div key={m.user_id} className="each-member">
                                        <span>{`${m.username} (${m.email})`}</span>
                                        <span
                                            className="x"
                                            onClick={() => handleRemoveMember(m.user_id)}
                                        >
                                            ✕
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p>No members added yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* ---------- ACTION BUTTONS ---------- */}
                <div className="action-buttons">
                    <button type="button" className="follow-up-btn" onClick={handleBack}>
                        BACK
                    </button>
                    <button type="submit" className="follow-up-btn">
                        UPDATE
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateMeetDetails;
