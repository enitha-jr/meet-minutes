import { io } from "socket.io-client";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const socket = io(BASE_URL, {
  autoConnect: false,
});

socket.on("connect", () => console.log("Socket connected:", socket.id));
socket.on("disconnect", () => console.log("Socket disconnected"));
socket.on("connect_error", (err) => console.error("Socket error:", err.message));

export default socket;
