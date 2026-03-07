import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import taskService from "../../services/taskServices";
import "../../styles/Mytasks.css";

function Mytasks() {

  const userData = useSelector((state) => state.auth);
  const [tasklist, setTasklist] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showpopup, setShowpopup] = useState(false);

  const assignedCount = tasklist.filter((t) => t.status === "assigned").length;
  const pendingCount = tasklist.filter((t) => t.status === "pending").length;
  const completedCount = tasklist.filter((t) => t.status === "completed").length;

  const showTaskform = (task) => {
    setSelectedTask(task);
    setShowpopup(true);
  };

  const handleClose = () => {
    setShowpopup(false);
    setSelectedTask(null);
  };

  const handleSubmit = async (taskid) => {
    try {
      // console.log(taskid);
      await taskService.updateMyTask({taskid});

      setTasklist(prev =>
        prev.map(t => 
          t.taskid === taskid
            ? { ...t, status: t.status === "assigned" ? "pending" : "assigned" } 
            : t
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userData?.user_id) {
      (async () => {
        try {
          const data = await taskService.myTasks(userData.user_id);
          const formatted = data.map(item => ({
            ...item,
            date: item.date ? String(item.date).split("T")[0] : null
          }));
          setTasklist(formatted);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [userData.user_id]);

  return (
    <div className='mytasks-content'>
      <div className='task-stats-row'>
        <div className='task-stat-card stat-assigned'>
          <span>Assigned</span>
          <strong>{assignedCount}</strong>
        </div>
        <div className='task-stat-card stat-pending'>
          <span>Review Pending</span>
          <strong>{pendingCount}</strong>
        </div>
        <div className='task-stat-card stat-completed'>
          <span>Completed</span>
          <strong>{completedCount}</strong>
        </div>
      </div>

      {!tasklist.length ? (
        <div className='no-tasks-box'>
          <h5>No tasks assigned yet</h5>
          <p>Tasks assigned to you will appear here.</p>
        </div>
      ) : (
        <div className='mytasks-container'>
          <table className='mytasks-table'>
            <tbody>
              {tasklist.map((task, index) => (
                <tr className='mytasks-table-row' key={task.taskid || index}>
                  <td>{index + 1}</td>

                  <td onClick={() => showTaskform(task)}>{task.task}</td>

                  <td onClick={() => showTaskform(task)}>{task.date}</td>

                  <td>
                    <button
                      className={`mytasks-status-btn ${task.status}`}
                      onClick={() => showTaskform(task)}
                    >
                      {task.status.toUpperCase()}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showpopup && selectedTask && (
        <div className='task-form-content'>
          <div className='overlay' onClick={handleClose}></div>

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
                <label>Due Date:</label>
                <div>{selectedTask.date}</div>
              </div>


              <div className='task-btn'>
                {selectedTask.status !== "completed" ? (
                  <button className={`mytasks-status-btn ${selectedTask.status}`}
                    onClick={() => {
                      handleSubmit(selectedTask.taskid);
                      handleClose();
                    }}
                  > 
                    {selectedTask.status.toUpperCase()}
                  </button>
                ) : (
                  <button className='mytasks-status-btn completed'>
                    COMPLETED
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mytasks;
