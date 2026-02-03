import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../styles/Minutes.css';
import { FiPlus, FiTrash2, FiEdit } from "react-icons/fi";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { useSelector } from 'react-redux';
import meetServices from '../../services/meetServices';
import { useOutletContext } from 'react-router-dom';

const Minutes = () => {
  const { meetingid } = useParams();
  const [note, setNote] = useState("");
  const [istask, setIstask] = useState(0);
  const userData = useSelector((state) => state.auth);
  const { meetingdetails } = useOutletContext();

  const [minutelist, setMinutelist] = useState([]);
  useEffect(() => {
    const fetchMinutes = async () => {
      try {
        const data = await meetServices.getMinutes(meetingid);
        setMinutelist(data);
      } catch (error) {
        console.error("Error fetching minutes:", error);
      }
    };
    fetchMinutes();
  }, []);

  const confirmDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this minute?')) {
      handleDelete(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      await meetServices.deleteMinute(meetingid, id);
      setMinutelist(minutelist.filter((minute) => minute.minuteid !== id));
    } catch (error) {
      console.error("Error deleting minute:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newminute = { minute: note, istask: istask, mid: meetingdetails.mid };
    try {
      const data = await meetServices.addMinute(meetingid, newminute);
      setMinutelist([...minutelist, data]);
      setNote("");
      setIstask(0);
    } catch (error) {
      console.error("Error adding minute:", error);
    }
  };

  // console.log(meetingdetails)

  return (
    <div className='minute-content'>
      <div className="minute-container">
        {!minutelist.length > 0 ? (<div style={{ textAlign: "center" }}>No minutes!</div>) :
          <>
            <h3 className='head3'>Minutes</h3>
            <table className='minute-table'>
              <tbody>
                {minutelist.map((eachminute, index) => (
                  <tr className='minute-table-row' key={index}>
                    <td>{index + 1}</td>
                    <td>{eachminute.minute}</td>
                    <td>{eachminute.istask ? <RiCheckboxCircleFill size={20} color="#0077B5" /> : <></>}</td>
                    {(userData?.user_id === meetingdetails?.host.user_id || userData?.user_id === meetingdetails?.minutetaker.user_id) && (
                      <td className='minute-handlers'>
                        <FiEdit color="#055aba" type='submit' role='button' className='minute-edit' />
                        <FiTrash2 color="#bb2124" type='submit' role='button' className='minute-delete' onClick={() => confirmDelete(eachminute.minuteid)} />
                      </td>
                    )
                    }
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        }
      </div>
      {
        meetingdetails.status === 'ongoing' && (userData?.user_id === meetingdetails?.host.user_id || userData?.user_id === meetingdetails?.minutetaker.user_id) && (
          <div className="minute-input">
            <form className="minute-form" onSubmit={handleSubmit}>
              <input type="text" value={note} placeholder="Enter minutes"
                onChange={e => setNote(e.target.value)} required />
              <input
                type="checkbox"
                checked={istask === 1}
                onChange={e => setIstask(e.target.checked ? 1 : 0)}
              />
              <button type="submit" className="minute-add"> <FiPlus /> </button>
            </form>
          </div>
        )
      }
    </div>
  )
};

export default Minutes;
