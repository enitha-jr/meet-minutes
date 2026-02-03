import apiInstance from "./apiService";

const completeMeeting = async (meetingid) => {
    try {
        console.log("Completing meeting with ID:", meetingid);
        const response = await apiInstance.put(`/${meetingid}/endMeeting`);
        return response.data;
    }
    catch (error) {
        console.error("Error completing meeting:", error);
    }
}

const updateMeeting = async (meetingid, values) => {
    try {
        const response = await apiInstance.put(`/updatemeetingdetails/${meetingid}`, values);
        return response.data;
    }
    catch (error) {
        console.error("Error updating meeting:", error);
    }
}

/*************************MINUTE SERVICES************************** */

const addMinute = async (meetingid, minute) => {
    try {
        const response = await apiInstance.post(`/${meetingid}/minutes`, minute);
        // console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error adding minute:", error);
    }
}

const getMinutes = async (meetingid) => {
    try {
        const response = await apiInstance.get(`/${meetingid}/minutes`);
        return response.data;
    }
    catch (error) {
        console.error("Error fetching minutes:", error);
    }
}

const deleteMinute = async (meetingid, minuteid) => {
    try {
        const response = await apiInstance.delete(`/${meetingid}/minutes/${minuteid}`);
        return response.data;
    }
    catch (error) {
        console.error("Error deleting minute:", error);
    }
}

const getSingleMinute = async (meetingid, minuteid) => {
    try {
        const response = await apiInstance.get(`/${meetingid}/minutes/${minuteid}`);
        return response.data;
    }
    catch (error) {
        console.error("Error fetching single minute:", error);
    }
}

const updateMinute = async (meetingid, minuteid, minute) => {
    try {
        const response = await apiInstance.put(`/${meetingid}/minutes/${minuteid}`, minute);
        return response;
    }
    catch (error) {
        console.error("Error updating minute:", error);
    }
}

/*************************TASK SERVICES***************************/
const fetchTaskMinutes = async (meetingid) => {
    try {
        const response = await apiInstance.get(`/${meetingid}/taskminutes`);
        return response.data;
    }
    catch (error) {
        console.error("Error fetching taskminutes");
    }
}


const addTask = async (meetingid, task) => {
    try {
        const response = await apiInstance.post(`/${meetingid}/tasks`, task);
        return response;
    }
    catch (error) {
        console.error("Error adding task:", error);
    }
}

const getTasks = async (meetingid) => {
    try {
        const response = await apiInstance.get(`/${meetingid}/tasks`);
        return response.data;
    }
    catch (error) {
        console.error("Error fetching tasks:", error);
    }
}

const deleteTask = async (meetingid, taskid) => {
    try {
        const response = await apiInstance.delete(`/${meetingid}/tasks/${taskid}`);
        return response;
    }
    catch (error) {
        console.error("Error deleting task:", error);
    }
}

const fetchMembers = async (meetingid) => {
    try {
        const response = await apiInstance.get(`/${meetingid}/members`);
        return response.data;
    }
    catch (error) {
        console.error("Error fetching members:", error);
    }
}

const updateAttendance = async (attendanceData) => {
    try {
        console.log("Updating attendance with data:", attendanceData);
        const response = await apiInstance.post(`/attendance/update`, attendanceData);
        return response.data;
    }
    catch (error) {
        console.error("Error updating attendance:", error);
    }
}


const meetServices = {
    completeMeeting,
    updateMeeting,

    addMinute,
    getMinutes,
    deleteMinute,
    getSingleMinute,
    updateMinute,

    fetchTaskMinutes,
    addTask,
    getTasks,
    deleteTask,

    fetchMembers,
    updateAttendance,
}

export default meetServices;