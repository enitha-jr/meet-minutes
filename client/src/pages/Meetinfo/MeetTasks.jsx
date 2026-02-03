import React, { useState, useEffect, useContext, use } from 'react';
import { FiPlus } from "react-icons/fi";
import '../../styles/MeetTasks.css'
import { Link, useParams } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';
import { FiTrash2 } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import services from '../../services/services';
import meetServices from '../../services/meetServices';

const MeetTasks = () => {
    const userData = useSelector((state) => state.auth);
    const { meetingid } = useParams();
    const { meetingdetails } = useOutletContext();
    const [showpopup, setShowpopup] = useState(false);

    const [users, setUsers] = useState([]);
    const [minutelist, setMinutelist] = useState([]);
    const [minute, setMinute] = useState('');
    const [task, setTask] = useState('');
    const [desc, setDesc] = useState('');
    const [assignById, setAssignById] = useState(null);
    const [assignToId, setAssignToId] = useState(null);
    const [date, setDate] = useState('');

    const [tasklist, setTasklist] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        if (userData) {
            setAssignById(userData.user_id);
        }
    }, [userData]);

    useEffect(() => {
        const fetchMinutes = async () => {
            try {
                const data = await meetServices.fetchTaskMinutes(meetingid);
                setMinutelist(data);
            }
            catch (error) {
                console.error("Error fetching meeting by ID:", error);
            }
        }
        fetchMinutes();
    }, [meetingid]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // console.log("called fetchUsers");
                const data = await services.getUsers();
                setUsers(data);
            }
            catch (error) {
                console.error("Error fetching users:", error);
            }
        }
        fetchUsers();
    }, [meetingid]);

    // useEffect(() => {
    //     axios.get(`http://localhost:8000/meetings/${meetingid}/tasks`)
    //         .then(response => {
    //             const formattedTasks = response.data.map(item => {
    //                 if (item.date) item.date = String(item.date).split('T')[0];
    //                 return item;
    //             });
    //             setTasklist(formattedTasks);
    //         })
    //         .catch(error => console.log(error));
    // }, [meetingid]);

    const fetchTasks = async () => {
        try {
            const data = await meetServices.getTasks(meetingid);
            const formatted = data.map(item => ({
                ...item,
                date: item.date ? String(item.date).split('T')[0] : ''
            }));
            setTasklist(formatted);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [meetingid]);


    const showTaskform = (task = null) => {
        setSelectedTask(task);
        setShowpopup(true);
    };



    /*-----------------ADD TASK------------------*/
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newDate = new Date(date).toISOString().slice(0, 10);
        const newTask = {
            minuteid: parseInt(minute) || null,
            task,
            desc,
            assignby: parseInt(assignById),
            assignto: parseInt(assignToId),
            date: newDate,
            mid: meetingdetails?.mid
        };
        // console.log("New Task:", newTask);   
        setTasklist([...tasklist, newTask]);
        try {
            const response = await meetServices.addTask(meetingid, newTask);
            // console.log(response);
            setShowpopup(false);
            setMinute('');
            setTask('');
            setDesc('');
            setAssignToId('');
            setDate('');
            await fetchTasks();
        }
        catch (error) {
            console.error("Error adding task:", error);
        }
    }

    /*-------------------GET TASKS-------------------*/
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await meetServices.getTasks(meetingid);
                const formatted = data.map(item => ({
                    ...item,
                    date: item.date
                        ? String(item.date).split('T')[0].split('-').reverse().join('-')
                        : ''
                }));
                setTasklist(formatted);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        fetchTasks();
    }, [meetingid]);

    /*-------------------DELETE TASK-------------------*/
    const confirmDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            handleDelete(id);
        }
    }

    const handleDelete = async (id) => {
        try {
            await meetServices.deleteTask(meetingid, id);
            setTasklist(prev => prev.filter(task => task.taskid !== id));
            handleClose();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const handleClose = () => {
        setShowpopup(false);
        setSelectedTask(null);
        setAssignById(userData?.username || '');
    };

    const [filteredResults, setFilteredResults] = useState([]);
    useEffect(() => {
        if (userData?.user_id && meetingdetails?.host && tasklist.length > 0) {
            const results = tasklist.filter(
                (task) =>
                    userData.user_id === meetingdetails.host.user_id ||
                    task.assignby_id === userData.user_id
            );
            setFilteredResults(results);
        }
    }, [userData, meetingdetails, tasklist]);


    return (
        <div className='meettask-content'>
            <div className='add-button' onClick={() => showTaskform()}><FiPlus /> ADD</div>
            {filteredResults.length ? (
                <div className='task-container'>
                    <table className='task-table'>
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Task</th>
                                <th>Assigned By</th>
                                <th>Assigned To</th>
                                <th>Due Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredResults.map((eachtask, index) => (
                                <tr className='task-table-row' key={index} onClick={() => showTaskform(eachtask)}>
                                    <td>{index + 1}</td>
                                    <td>{eachtask.task}</td>
                                    <td>{eachtask.assignby_name}</td>
                                    <td>{eachtask.assignto_name}</td>
                                    <td>{eachtask.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className='task-container'>No Task</div>
            )}

            {showpopup && (
                <div className='task-form-content'>
                    <div className='overlay' onClick={handleClose}></div>
                    <div className='popup-container'>
                        <div className='head4'>
                            <h4>{selectedTask ? 'TASK DETAILS' : 'ADD NEW TASK'}</h4>
                        </div>
                        {selectedTask ? (
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
                                <div className='task-btn'>
                                    <FiEdit color="#055aba" size={20} className='task-edit-button' type='submit' role='button' />
                                    <FiTrash2 color="#bb2124" size={20} type='submit' role='button' onClick={() => confirmDelete(selectedTask.taskid)} />
                                </div>
                            </div>
                        ) : (
                            <form className='meettask-form' onSubmit={handleSubmit}>
                                <div>
                                    <label>Minute:</label>
                                    <select value={minute} onChange={e => setMinute(e.target.value)}>
                                        <option value="">Select Minute</option>
                                        {minutelist.map(min => (
                                            <option key={min.minuteid} value={min.minuteid}>
                                                {min.minute}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label>Task:</label>
                                    <input type='text' onChange={e => setTask(e.target.value)} required />
                                </div>
                                <div>
                                    <label>Description:</label>
                                    <textarea onChange={e => setDesc(e.target.value)} required />
                                </div>
                                <div>
                                    <label>Assigned By:</label>
                                    <input type="text" value={userData.username} readOnly />
                                </div>
                                <div>
                                    <label>Assigned To:</label>
                                    <select value={assignToId} onChange={e => setAssignToId(e.target.value)} required>
                                        <option value="">Select User</option>
                                        {users.map(user => (
                                            <option key={user.user_id} value={user.user_id}>
                                                {user.username} ({user.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label>Due Date:</label>
                                    <input type='date' onChange={e => setDate(e.target.value)} required />
                                </div>
                                <div className="meettask-btn">
                                    <button type="submit">CREATE TASK</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MeetTasks;
