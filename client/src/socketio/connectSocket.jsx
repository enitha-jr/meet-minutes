import socket from "./socket";

// socket.connect();
const connectSocket = (token) => {
    if (!token) return;
    // console.log("Connecting socket with token:", token);
    console.log("Connecting socket with token");
    socket.auth = { token };
    if (!socket.connected) {
        socket.connect();
    }
};

const disconnectSocket = () => {
    if (socket.connected) socket.disconnect();
};

export { connectSocket, disconnectSocket };

