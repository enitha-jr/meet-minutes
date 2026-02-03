import React, { useState, useEffect } from 'react'
import '../styles/Meetings.css'
import { Outlet } from 'react-router-dom';
import Nav1 from '../components/Nav1'
import schedule from '../assets/icons/schedule.png'
import { IoCalendarNumberSharp } from 'react-icons/io5';
import person from '../assets/icons/person.png'
import venue from '../assets/icons/apartment.png'
import meeting1 from '../assets/icons/meeting1.png'
import meeting2 from '../assets/icons/meeting2.png'
import { TbSquareRoundedLetterF } from "react-icons/tb";
import { IoLocationSharp } from "react-icons/io5";
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import services from '../services/services';

function Meetings() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const userData = useSelector((state) => state.auth);
  const [details, setDetails] = useState([]);
  // console.log(slug);

  useEffect(() => {
    const fetchMeetings = async () => {
      // console.log("Fetching meetings :", slug);
      console.log("user_id:"+userData.user_id);
      const data = await services.getMeetings(slug,userData.user_id);
      for (let item of data) {
        if (item.date) {
          item.date = String(item.date).split('T')[0];
        }
      }
      // console.log("Meetings data:", data);
      setDetails(data)
    }
    fetchMeetings();
  }, [slug]);

  const handleDetail = (meetingid) => {
    navigate(`/meeting/${meetingid}/details`);
  }

  return (
    <div className='meeting-container'>
      <div className='nav-container'>
        <Nav1 />
      </div>
      <div className="meet-body">
        {details.map((detail) => (
          <div className='meet-overview' key={detail.meetingid} onClick={() => handleDetail(detail.meetingid)}>
            <div className="followup-badge">
              {detail.followup === "yes" && (
                <TbSquareRoundedLetterF size="28" />
              )}
            </div>
            <div className='meet-image'>
              {userData.user_id === detail.host ?
                (<img src={meeting1} width="140" height="100" />) :
                (<img src={meeting2} width="140" height="100" />)
              }
            </div>
            <div className='meet-head'>
              <div className='meet-title'>
                {detail.title}
              </div>
            </div>
            <div className='meet-details'>
              <div className='meet-details-container'>
                <img src={person} width={22} />
                <div>{detail.host_name || "Unknown"}</div>
              </div>
              <div className='meet-details-container'>
                <IoCalendarNumberSharp size={22} />
                <div>{detail.date}</div>
              </div>
              <div className='meet-details-container'>
                <img src={schedule} width={22} />
                <div>{detail.time}</div>
              </div>
              <div className='meet-details-container'>
                <IoLocationSharp size={22} />
                <div>{detail.mode}</div>
              </div>
              {detail.mode === 'offline' && (
                <div className='meet-details-container'>
                  <img src={venue} width={22} />
                  <div>{detail.venue}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Meetings