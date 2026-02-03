import apiInstance from "./apiService";



// Fetch room by meeting ID
const getRoomByMeeting = async (meetingId) => {
  try {
    const response = await apiInstance.get(`/getRoomByMeeting/${meetingId}`);
    return response.data;
  }
  catch (error) {
    console.error("Error fetching room by meeting ID:", error);
  }
}

// Fetch all messages in a room
const getRoomMessages = async (roomId) => {
  try {
    const response = await apiInstance.get(`/message/room/${roomId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching room messages:", error);
  }
};

// Fetch all rooms (meetings) user belongs to
const getRoomsForUser = async () => {
  try {
    const response = await apiInstance.get('/message/rooms');
    return response.data;
  } catch (error) {
    console.error("Error fetching rooms:", error);
  }
};



const messageServices = {
  getRoomsForUser,
  getRoomMessages,
  getRoomByMeeting,
};

export default messageServices;
