const db = require("../utils/connectdb");

class messageController {

  getRoomByMeeting = async (req, res) => {
    const { meetingId } = req.params;
    const userId = req.user.user_id;

    try {
      const [meetingRows] = await db.query(
        `SELECT mid, title FROM meetings WHERE meetingid = ?`,
        [meetingId]
      );
      if (!meetingRows.length) {
        return res.status(404).json({ message: "Meeting not found" });
      }
      const { mid, title } = meetingRows[0];

      const [roomRows] = await db.query(
        `SELECT room_id FROM meeting_rooms WHERE mid = ?`,
        [mid]
      );
      if (!roomRows.length) {
        return res.status(404).json({ message: "Room not created for this meeting" });
      }
      const roomId = roomRows[0].room_id;

      // Check if user is a member of the room
      const [memberRows] = await db.query(
        `SELECT 1 FROM meeting_room_members 
         WHERE room_id = ? AND user_id = ?`,
        [roomId, userId]
      );
      if (!memberRows.length) {
        return res.status(403).json({ message: "Access denied to this room" });
      }

      return res.status(200).json({
        roomId,
        mid,
        title
      });
    } catch (err) {
      console.error("getRoomByMeeting error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };



  // Fetch all rooms (meetings/follow-ups) user belongs to
  getRoomsForUser = async (req, res) => {
    const user_id = req.user.user_id;

    try {
      const query = `
        SELECT 
          m.meetingid AS roomId,
          m.title,
          m.followup,
          m.host,
          m.minutetaker,
          m.members
        FROM meetings m
        WHERE JSON_CONTAINS(m.members, CAST(? AS JSON))
          OR m.host = ?
          OR m.minutetaker = ?
      `;

      const [rooms] = await db.query(query, [user_id, user_id, user_id]);
      res.status(200).json(rooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      res.status(500).json({ error: error.message });
    }
  };

  // Fetch all messages in a room
  getRoomMessages = async (req, res) => {
    const roomId = req.params.roomId;

    try {
      const query = `
      SELECT 
        m.msg_id,
        m.room_id,
        m.content,
        m.created_at,
        m.sender_id,
        u.username
      FROM messages m
      LEFT JOIN users u
        ON m.sender_id = u.user_id
      WHERE m.room_id = ?
      ORDER BY m.created_at ASC
    `;

      const [messages] = await db.query(query, [roomId]);
      res.status(200).json(messages);

    } catch (error) {
      console.error("Error fetching room messages:", error);
      res.status(500).json({ error: error.message });
    }
  };


}

module.exports = new messageController();
