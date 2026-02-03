import React from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import "../../styles/ToBe.css"
import taskServices from '../../services/taskServices'
import { useOutletContext } from 'react-router-dom'

const Tobediscussed = () => {
    const { meetingid } = useParams()
    const [showpopup, setShowpopup] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const userData = useSelector((state) => state.auth)
    const { meetingdetails, setMeetingdetails } = useOutletContext();
    const showTaskform = (task) => {
        setSelectedTask(task);
        setShowpopup(!showpopup)
    }

    const [tobediscussed, setTobediscussed] = useState([]);
    const [notassigned, setNotassigned] = useState([]);

    useEffect(() => {
        const fetchTobediscussed = async () => {
            try {
                console.log(meetingdetails.mid);
                const data = await taskServices.getToBeDiscussed(meetingdetails.mid);
                const formatted = data.map(item => ({
                    ...item,
                    date: item.date
                        ? String(item.date).split('T')[0].split('-').reverse().join('-')
                        : ''
                }));
                setTobediscussed(formatted);
            } catch (error) {
                console.error("Error fetching to be discussed tasks:", error);
            }   
        };
        fetchTobediscussed();
    }, [meetingdetails])

    useEffect(() => {
        const fetchNotAssigned = async () => {
            try {
                const data = await taskServices.getToBeNotAssigned(meetingdetails.mid);
                setNotassigned(data);
            } catch (error) {
                console.error("Error fetching not assigned tasks:", error);
            }
        };
        fetchNotAssigned();
    }, [meetingdetails])

    return (
        <div className='tobe-content'>
            <div className="tobe-container">
                {
                    tobediscussed.length > 0 && meetingdetails.followup === 'yes' &&
                    <>
                        <h3 className='head3'>To be discussed</h3>
                        <table className='tobe-table'>
                            <tbody>
                                {tobediscussed.map((eachtask, index) => (
                                    <tr className='tobe-table-row' key={index} onClick={() => showTaskform(eachtask)}>
                                        <td data-label="Task">{eachtask.task}</td>
                                        <td data-label="Date">{eachtask.date}</td>
                                        <td data-label="Status">
                                            {eachtask.status === "assigned" ? (
                                                <button className={`tobe-status-btn ${eachtask.status}`}>ASSIGNED</button>
                                            ) : eachtask.status === "pending" ? (
                                                <button className={`tobe-status-btn ${eachtask.status}`}>PENDING</button>
                                            ) : eachtask.status === "completed" ? (
                                                <button className={`tobe-status-btn ${eachtask.status}`}>COMPLETED</button>
                                            ) : (
                                                <></>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                }
                {notassigned.length > 0 && meetingdetails.followup === 'yes' &&
                    <>
                        <table className='tobe-table'>
                            <tbody>
                                {notassigned.map((item, index) => (
                                    <tr className='tobe-table-row' key={index}>
                                        <td data-label="Task" className='Task'>{item.minute}</td>
                                        <td data-label="Date"></td>
                                        <td data-label="Status">
                                            <button className={`tobe-status-btn ${item.status}`}>NOT ASSIGNED</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
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
                                <div>{selectedTask.assignby}</div>
                            </div>
                            <div>
                                <label>Assigned To:</label>
                                <div>{selectedTask.assignto}</div>
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

export default Tobediscussed