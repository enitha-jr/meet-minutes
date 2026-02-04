import socket from "./socket";
import { isDemo, demoDB } from "../services/demoService";

export const joinRoom = (room_id) => {
  if (isDemo()) {
    console.log("Demo mode: Room joined (simulated)");
    return;
  }
  
  if (!socket.connected) {
    console.warn("Socket not connected");
    return;
  }
  socket.emit("join_room", { room_id });
};

export const sendMessage = ({ room_id, content }) => {
  if (isDemo()) {
    console.log("Demo mode: Message sent (simulated)");
    // Add message to demo DB for immediate feedback
    const newMessage = {
      msg_id: demoDB.messages.length + 1,
      sender_id: 1,
      sender: "Demo Host",
      content,
      room_id,
      timestamp: new Date().toISOString()
    };
    demoDB.messages.push(newMessage);
    
    // Trigger callback if listener is set
    if (window._demoMessageCallback) {
      window._demoMessageCallback(newMessage);
    }
    return;
  }
  
  if (!socket.connected) {
    console.warn("Socket not connected");
    return;
  }
  socket.emit("send_message", { room_id, content });
};

export const listenMessages = (callback) => {
  if (isDemo()) {
    console.log("Demo mode: Listening for messages (simulated)");
    window._demoMessageCallback = callback;
    return;
  }
  
  socket.on("receive_message", (message) => {
    callback(message);
  });
};

export const removeMessageListener = () => {
  if (isDemo()) {
    window._demoMessageCallback = null;
    return;
  }
  
  socket.off("receive_message");
};
