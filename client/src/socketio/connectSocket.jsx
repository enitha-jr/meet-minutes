import socket from "./socket";
import { isDemo } from "../services/demoService";

// socket.connect();
const connectSocket = (token) => {
    if (!token) return;
    
    // Don't connect socket in demo mode
    if (isDemo()) {
        console.log("Demo mode: Socket connection skipped");
        return;
    }
    
    // console.log("Connecting socket with token:", token);
    console.log("Connecting socket with token");
    socket.auth = { token };
    if (!socket.connected) {
        socket.connect();
    }
};

const disconnectSocket = () => {
    if (isDemo()) return;
    if (socket.connected) socket.disconnect();
};

export { connectSocket, disconnectSocket };

