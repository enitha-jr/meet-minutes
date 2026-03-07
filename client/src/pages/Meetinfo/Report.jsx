import React from 'react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import "../../styles/Report.css"
import { useParams } from 'react-router-dom'
import taskServices from '../../services/taskServices'

function Report() {
  const { meetingid } = useParams();
  const userData = useSelector((state) => state.auth)
  const [tasklist, setTasklist] = useState([])
  const [notasklist, setNotasklist] = useState([])
  const [selectedTask, setSelectedTask] = useState(null);
  const [assignedlist, setAssignedlist] = useState([]);
  const [pendinglist, setPendinglist] = useState([]);
  const [completedlist, setCompletedlist] = useState([]);

  const [showpopup, setShowpopup] = useState(false);
  const showTaskform = (task) => {
    setSelectedTask(task);
    setShowpopup(!showpopup)
  }

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const data = await taskServices.AllTasks(meetingid);
        setTasklist(data);
      } catch (error) {
        console.error("Error fetching my tasks:", error);
      }
    };
    fetchAllTasks();

  }, [userData.user_id])

  useEffect(() => {
    const fetchNotAssignedTasks = async () => {
      try {
        const data = await taskServices.getNotAssignedTasks(meetingid);
        setNotasklist(data);
      } catch (error) {
        console.error("Error fetching not assigned tasks:", error);
      }
    };
    fetchNotAssignedTasks();
  }, [userData.user_id])

  useEffect(() => {
    const assigned = tasklist.filter(task => task.status === 'assigned');
    const pending = tasklist.filter(task => task.status === 'pending');
    const completed = tasklist.filter(task => task.status === 'completed');

    setAssignedlist(assigned);
    setPendinglist(pending);
    setCompletedlist(completed);
  }, [tasklist]);

  return (
    <div className='report-content'>
      <div className="report-container">
        {assignedlist.length > 0 &&
          <table className='report-table'>
            <tbody>
              {assignedlist.map((eachtask, index) => (
                <tr className={`report-table-row ${eachtask.status}`} key={index} onClick={() => showTaskform(eachtask)}>
                  <td>{eachtask.task}</td>
                  <td><button className={`report-status-btn ${eachtask.status}`}>ASSIGNED</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        }
        {pendinglist.length > 0 &&
          <table className='report-table'>
            <tbody>
              {pendinglist.map((eachtask, index) => (
                <tr className={`report-table-row ${eachtask.status}`} key={index} onClick={() => showTaskform(eachtask)}>
                  <td>{eachtask.task}</td>
                  <td><button className={`report-status-btn ${eachtask.status}`}>PENDING</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        }
        {completedlist.length > 0 &&
          <table className='report-table'>
            <tbody>
              {completedlist.map((eachtask, index) => (
                <tr className={`report-table-row ${eachtask.status}`} key={index} onClick={() => showTaskform(eachtask)}>
                  <td>{eachtask.task}</td>
                  <td><button className={`report-status-btn ${eachtask.status}`}>COMPLETED</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        }
        {notasklist.length > 0 &&
          <table className='report-table'>
            <tbody>
              {notasklist.map((item, index) => (
                <tr className={`report-table-row ${item.status}`} key={index}>
                  <td>{item.minute}</td>
                  <td>
                    <button className={`report-status-btn ${item.status}`}>NOT ASSIGNED</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>
      {showTaskform && selectedTask && (
        <div className='task-form-content'>
          <div className='overlay' onClick={() => showTaskform(false)}></div>
          <div className='popup-container'>
            <div className='head4'>
              <h4>TASK DETAILS</h4>
            </div>
            <div className='mytask-card'>
              <div>
                <label>Task:</label>
                <div>{selectedTask.task}</div>
              </div>
              <div>
                <label>Description:</label>
                <div>{selectedTask.description}</div>
              </div>
              <div>
                <label>Assigned By:</label>
                <div>{selectedTask.assignby_name}</div>
              </div>
              <div>
                <label>Assigned To:</label>
                <div>{selectedTask.assignto_name}</div>
              </div>
              <div>
                <label>Due Date:</label>
                <div>{selectedTask.date}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Report