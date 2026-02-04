import apiInstance from "./apiService";

const getUsers = async () => {
    try {
        // console.log("Fetching users");
        const response = await apiInstance.get('/users');
        return response.data;
    }
    catch (error) {
        console.error("Error fetching users:", error);
    }
}

const getNextMid = async () => {
    try {
        const response = await apiInstance.get('/nextmid');
        return response.data;
    }
    catch (error) {
        console.error("Error fetching next MID:", error);
    }
}

const createMeeting = async (meetingData) => {
    try {
        const response = await apiInstance.post('/newmeeting', meetingData);
        return response.data;
    }
    catch (error) {
        console.error("Error creating meeting:", error);
    }
}



const getMeetings = async (slug, userId) => {
    try {
        // console.log("Fetching meetings :", slug);
        const response = await apiInstance.post(`/meetings/${slug}`, { userId });
        return response.data;
    }
    catch (error) {
        console.error("Error fetching meetings:", error);
    }
}

const getMeetingById = async (meetingid) => {
    try {
        const response = await apiInstance.get(`/meeting/${meetingid}/details`);
        return response.data;
    }
    catch (error) {
        console.error("Error fetching meeting by ID:", error);
    }
}

const getMeetingsByUser = async (user_id) => {
    try {
        const response = await apiInstance.get(`/meetings/${user_id}`);
        return response.data;
    }
    catch (error) {
        console.error("Error fetching meetings by user:", error);
    }
}

 const generateMeetLink = async (title) => {
    try {
      console.log("Generating meet link for title:", title);
      const response = await apiInstance.post('/google/generate-meet', { title });
      console.log(" Response from API:", response.data);
      return response.data;
    }
    catch (error) {
      console.error("Error generating meet link:", error);
    }
  }

const services = {
    getUsers,
    getNextMid,
    createMeeting,
    getMeetings,
    getMeetingById,
    getMeetingsByUser,
    generateMeetLink,
}

export default services;