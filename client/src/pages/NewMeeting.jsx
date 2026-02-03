import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "../styles/NewMeeting.css";
import { useSelector } from 'react-redux';
import services from '../services/services';
import { PiPlusCircleFill } from "react-icons/pi";

function NewMeeting() {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector(state => state.auth);
  // ---------- State Variables ----------
  const [page, setPage] = useState(1);
  const [followup, setFollowup] = useState('');
  const [mid, setMid] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [hostId, setHostId] = useState(userData?.user_id || null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [mode, setMode] = useState('');
  const [venue, setVenue] = useState('');
  const [meetLink, setMeetLink] = useState('');
  const [minutetakerId, setMinutetakerId] = useState('');
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [users, setUsers] = useState([]);

  // ---------- Fetch all users ----------
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersList = await services.getUsers();
        setUsers(usersList || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (location.state?.followup) {
      setFollowup(location.state.followup);
    }
  }, [location.state]);

  // ---------- Handle Follow-up MID ----------
  useEffect(() => {
    const fetchNextMid = async () => {
      try {
        if (followup === 'no') {
          const data = await services.getNextMid();
          setMid(data.nextmid);
        } else if (followup === 'yes') {
          const meetingdetails = location.state?.meetingdetails;
          if (meetingdetails) setMid(meetingdetails.mid || '');
        } else {
          setMid('');
        }
      } catch (error) {
        console.error("Error fetching MID:", error);
      }
    };
    fetchNextMid();
  }, [followup, location.state]);


  // ---------- Add Member ----------
  const handleAddMember = () => {
    const memberId = parseInt(selectedMember);
    if (memberId && !members.includes(memberId)) {
      setMembers([...members, memberId]);
      setSelectedMember('');
    }
  };

  // ---------- Remove Member ----------
  const handleRemoveMember = (id) => {
    setMembers(members.filter(mem => mem !== id));
  };

  // ---------- Submit Meeting ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newDate = new Date(date).toISOString().slice(0, 10);

    if (members.length === 0) {
      alert("Please add at least one member.");
      return;
    }

    const meetingdetails = {
      followup,
      mid,
      title,
      description: desc,
      host: userData.user_id,
      minutetaker: parseInt(minutetakerId),
      date: newDate,
      time,
      mode,
      venue,
      meet_link: meetLink,
      members, // JSON array of user_id
    };

    // console.log("Meeting Details:", meetingdetails);

    try {
      if (userData?.role === 'user') {
        await services.createMeeting(meetingdetails);
      } else {
        await services.createMeeting(meetingdetails);
      }
      console.log('Meeting created successfully');
      navigate('/meetings/upcoming');
    } catch (error) {
      console.error('Error creating meeting:', error);
    }
  };

  const generateLink = async () => {
    try {
      const res = await services.generateMeetLink(title || "MeetMinutes Meeting");
      if (res?.meetLink) {
        setMeetLink(res.meetLink);
      } else {
        alert("Failed to generate Meet link");
      }
    } catch (error) {
      console.error("Error generating Meet link:", error);
      alert("Error generating Meet link");
    }
  };




  return (
    <div className="newmeeting-content">
      <div className="newmeeting-container">
        <h3 className="head3">NEW MEETING</h3>

        <form className="newmeeting-form" onSubmit={handleSubmit}>
          {/* ---------- PAGE 1: Basic Details ---------- */}
          {page === 1 && (
            <div className="form-page">
              <div className="form-row">
                <div className="form-group half">
                  <label>Follow-Up:</label>
                  <select value={followup} onChange={e => setFollowup(e.target.value)} required>
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div className="form-group half">
                  <label>Meeting ID:</label>
                  <input
                    type="number"
                    value={mid}
                    onChange={e => setMid(e.target.value)}
                    disabled={followup === 'no' || followup === 'yes'}
                    required
                  />
                </div>
              </div>


              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  style={{ resize: "none" }}
                />
              </div>

              <div className="pagination-btns">
                <div></div>
                <button type="button" onClick={() => setPage(2)}>Next</button>
              </div>
            </div>
          )}

          {/* ---------- PAGE 2: Schedule ---------- */}
          {page === 2 && (
            <div className="form-page">

              <div className="form-row">
                <div className="form-group half">
                  <label>Date:</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                </div>

                <div className="form-group half">
                  <label>Time:</label>
                  <input type="time" value={time} onChange={e => setTime(e.target.value)} required />
                </div>
              </div>

              <div className="form-group">
                <label>Mode:</label>
                <select value={mode} onChange={e => setMode(e.target.value)} required>
                  <option value="">Select</option>
                  <option value="offline">Offline</option>
                  <option value="online">Online</option>
                </select>
              </div>

              {mode === 'offline' && (
                <div className="form-group">
                  <label>Venue:</label>
                  <input type="text" value={venue} onChange={e => setVenue(e.target.value)} required />
                </div>
              )}

              {mode === 'online' && (
                <div className="form-group">
                  <div className="meetlink-header">
                    <label>Meet Link:</label>
                    <button className="meetlink-generate-btn" type="button" onClick={generateLink}>
                      Generate
                    </button>
                  </div>
                  <input type="url" value={meetLink} onChange={e => setMeetLink(e.target.value)} required />
                </div>
              )}

              <div className="pagination-btns">
                <button type="button" onClick={() => setPage(1)}>Back</button>
                <button type="button" onClick={() => setPage(3)}>Next</button>
              </div>
            </div>
          )}


          {/* ---------- PAGE 3: Members ---------- */}
          {page === 3 && (
            <div className="form-page">
              <div className="form-group">
                <label>Minute Taker:</label>
                <select
                  value={minutetakerId}
                  onChange={e => setMinutetakerId(e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  {users.map(user => (
                    <option key={user.user_id} value={user.user_id}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Members:</label>
                <div className="member-select">
                  <select value={selectedMember} onChange={e => setSelectedMember(e.target.value)}>
                    <option value="">Select Member</option>
                    {users.map(user => (
                      <option key={user.user_id} value={user.user_id}>
                        {user.username} ({user.email})
                      </option>
                    ))}
                  </select>
                  <PiPlusCircleFill className="add-icon" onClick={handleAddMember} />
                </div>
              </div>

              <div className="members-list">
                {members.length ? members.map((id, i) => {
                  const user = users.find(u => u.user_id === id);
                  return (
                    <div key={i} className="each-member">
                      <span>{user ? user.username : id}</span>
                      <span className="x" onClick={() => handleRemoveMember(id)}>x</span>
                    </div>
                  );
                }) : <p>No members added yet.</p>}
              </div>

              <div className="pagination-btns">
                <button type="button" onClick={() => setPage(2)}>Back</button>
                <button type="submit">Submit</button>
              </div>
            </div>
          )}
        </form>

      </div>
    </div>
  );
}

export default NewMeeting;
