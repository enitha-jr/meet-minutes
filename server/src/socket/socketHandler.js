const db = require("../utils/connectdb");


async function verifyUserInRoom(userId, roomId) {

    const [result] = await db.query(
        "SELECT mid FROM meeting_rooms WHERE room_id = ?",
        [roomId]
    );
    if (!result.length) return false;

    const [rows] = await db.query(
        "SELECT members, host, minutetaker FROM meetings WHERE mid = ?",
        [result[0].mid]
    );
    if (!rows.length) return false;

    const meeting = rows[0];

    let members = [];
    if (Array.isArray(meeting.members)) {
        members = meeting.members;
    } else if (typeof meeting.members === "string") {
        members = JSON.parse(meeting.members);
    }

    const allowedUsers = [
        meeting.host,
        meeting.minutetaker,
        ...members
    ];
    return allowedUsers.includes(userId);
}

const sendMessage = (io) => {
    io.on('connection', (socket) => {
        console.log(`New client connected: ${socket.user.user_id}`);
        // ------------------ JOIN ROOM ------------------
        socket.on("join_room", async ({ room_id }) => {
            try {
                const isAllowed = await verifyUserInRoom(socket.user.user_id, room_id);
                if (!isAllowed) {
                    return socket.emit("error", { message: "Access denied to this room" });
                }

                socket.join(room_id.toString());
                console.log(`User ${socket.user.user_id} joined room ${room_id}`);
                socket.emit("joined_room", { room_id }); // optional confirmation

            } catch (err) {
                console.error(err);
                socket.emit("error", { message: "Cannot join room" });
            }
        });

        // ------------------ SEND MESSAGE ------------------
        socket.on("send_message", async ({ room_id, content }) => {
            try {
                const isAllowed = await verifyUserInRoom(socket.user.user_id, room_id);
                if (!isAllowed) {
                    return socket.emit("error", { message: "Access denied to this room" });
                }

                // Insert message into DB (receiver_id reused for room)
                const [result] = await db.query(
                    "INSERT INTO messages (sender_id, room_id, content) VALUES (?, ?, ?)",
                    [socket.user.user_id, room_id, content]
                );

                // Fetch the newly inserted message
                const [row] = await db.query(
                    "SELECT * FROM messages WHERE msg_id = ?",
                    [result.insertId]
                );
                const newMessage = row[0];

                // Emit to all members in the room
                io.to(room_id.toString()).emit("receive_message", newMessage);

            } catch (err) {
                console.error(err);
                socket.emit("error", { message: "Message not sent" });
            }
        });

        // ------------------ DISCONNECT ------------------
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.user.user_id}`);
        });
    });
};


function socketHandler(io) {
    sendMessage(io);
}

module.exports = socketHandler;
