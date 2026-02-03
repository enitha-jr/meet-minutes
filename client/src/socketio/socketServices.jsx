import socket from "./socket";

export const joinRoom = (room_id) => {
  if (!socket.connected) {
    console.warn("Socket not connected");
    return;
  }
  socket.emit("join_room", { room_id });
};

export const sendMessage = ({ room_id, content }) => {
  if (!socket.connected) {
    console.warn("Socket not connected");
    return;
  }
  socket.emit("send_message", { room_id, content });
};

export const listenMessages = (callback) => {
  socket.on("receive_message", (message) => {
    callback(message);
  });
};

export const removeMessageListener = () => {
  socket.off("receive_message");
};
