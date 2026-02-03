import apiInstance from "./apiService";

const myTasks = async (user_id) => {
    try {
        const response = await apiInstance.get(`/tasks/mytasks/${user_id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching my tasks:", error);
    }
}

const assignedTasks = async (user_id) => {
    try {
        const response = await apiInstance.get(`/tasks/assignedtasks/${user_id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching assigned tasks:", error);
    }
}

const updateMyTask = async (taskid) => {
    try {
        const response = await apiInstance.put(`/tasks/updatemytask`, taskid);
        return response.data;
    } catch (error) {
        console.error("Error updating task:", error);
    }
}
const updateAssignedTask = async (taskid) => {
    try {
        const response = await apiInstance.put(`/tasks/updateassignedtask`, taskid);
        return response.data;
    } catch (error) {
        console.error("Error updating task:", error);
    }
}

const AllTasks = async (meetingid) => {
    try {
        const response = await apiInstance.get(`/${meetingid}/alltasks`);
        return response.data;
    } catch (error) {
        console.error("Error fetching all tasks:", error);
    }
}

const getNotAssignedTasks = async (meetingid) => {
    try {
        const response = await apiInstance.get(`/${meetingid}/notassigned`);
        return response.data;
    } catch (error) {
        console.error("Error fetching not assigned minutes:", error);
    }
}

const getToBeDiscussed = async (mid) => {
    try {
        console.log(mid);
        const response = await apiInstance.get(`/${mid}/tobediscussed/alltasks`);
        return response.data;
    } catch (error) {
        console.error("Error fetching to be discussed tasks:", error);
    }
}

const getToBeNotAssigned = async (mid) => {
    try {
        const response = await apiInstance.get(`/${mid}/tobediscussed/notassigned`);
        return response.data;
    } catch (error) {
        console.error("Error fetching to be not assigned tasks:", error);
    }
}

export default {
    myTasks,
    assignedTasks,
    updateMyTask,
    updateAssignedTask,
    AllTasks,
    getNotAssignedTasks,
    getToBeDiscussed,
    getToBeNotAssigned,
};