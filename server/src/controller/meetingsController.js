const db = require('../utils/connectdb');

class meetingsController {


    getNextMid = async (req, res) => {
        try {
            const sql = "select max(mid)+1 as nextmid from meetings";
            const [rows] = await db.query(sql);
            const nextmid = rows[0].nextmid || 101;
            res.json({ nextmid });
        }
        catch (error) {
            console.error("Error fetching next MID:", error);
            res.status(500).json({ message: "Error fetching next MID" });
        }
    }


    createMeeting = async (req, res) => {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            const {
                followup,
                mid,
                title,
                description,
                host,
                minutetaker,
                date,
                time,
                mode,
                venue,
                meet_link,
                members = []
            } = req.body;

            // 1. Insert into meetings table
            const [result] = await connection.query(
                `INSERT INTO meetings 
            (followup, mid, title, description, host, minutetaker, date, time, mode, venue, meet_link, members, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ongoing')`,
                [
                    followup,
                    mid,
                    title,
                    description,
                    host,
                    minutetaker,
                    date,
                    time,
                    mode,
                    venue,
                    meet_link,
                    JSON.stringify(members)
                ]
            );

            const meetingId = result.insertId;
            let roomId = null;

            // 2. Create room if followup is "no"
            if (followup === "no") {
                // Create a room linked to this meeting
                const [roomResult] = await connection.query(
                    `INSERT INTO meeting_rooms (mid) VALUES (?)`,
                    [meetingId]
                );

                roomId = roomResult.insertId;

                // Collect unique users: host, minute taker, members
                const uniqueUsers = new Set([
                    host,
                    minutetaker,
                    ...members.map(m => m.user_id ?? m)
                ]);

                // Prepare bulk insert values
                const memberValues = [...uniqueUsers].map(userId => [roomId, userId]);

                if (memberValues.length > 0) {
                    await connection.query(
                        `INSERT INTO meeting_room_members (room_id, user_id) VALUES ?`,
                        [memberValues]
                    );
                }
            }

            // 3. Commit transaction
            await connection.commit();

            res.status(201).json({
                success: true,
                message: "Meeting created successfully",
                meetingId,
                roomCreated: followup === "no",
                roomId
            });

        } catch (err) {
            // Rollback in case of error
            await connection.rollback();
            console.error("Error creating meeting:", err);
            res.status(500).json({ success: false, message: "Error creating meeting", error: err.message });
        } finally {
            // Release connection
            connection.release();
        }
    };


    getMeetings = async (req, res) => {
        try {
            const { slug } = req.params;
            const { userId: user_id } = req.body;

            let query = "";
            let values = [];

            if (slug === "upcoming") {
                query = `
                    SELECT m.*, u.username AS host_name
                    FROM meetings m
                    JOIN users u ON m.host = u.user_id
                    WHERE m.status='ongoing' 
                    AND (m.host = ? OR m.minutetaker = ? OR JSON_CONTAINS(m.members, JSON_ARRAY(?)))
                `;
                values = [user_id, user_id, user_id];
            } else if (slug === "completed") {
                query = `
                    SELECT m.*, u.username AS host_name
                    FROM meetings m
                    JOIN users u ON m.host = u.user_id
                    WHERE m.status='completed' 
                    AND (m.host = ? OR m.minutetaker = ? OR JSON_CONTAINS(m.members, JSON_ARRAY(?)))
                    ORDER BY m.date DESC
                `;
                values = [user_id, user_id, user_id];
            } else if (slug === "mymeeting") {
                query = `
                    SELECT m.*, u.username AS host_name
                    FROM meetings m
                    JOIN users u ON m.host = u.user_id
                    WHERE m.host = ?
                `;
                values = [user_id];
            } else {
                return res.status(400).json({ message: "Invalid slug" });
            }

            const [meetings] = await db.query(query, values);
            res.json(meetings);

        } catch (error) {
            console.error("Error fetching meetings:", error);
            res.status(500).json({ message: "Error fetching meetings" });
        }
    };


    getMeetingById = async (req, res) => {
        try {
            const { meetingid } = req.params;

            const [meetings] = await db.query("SELECT * FROM meetings WHERE meetingid = ?", [meetingid]);
            if (meetings.length === 0) {
                return res.status(404).json({ message: "Meeting not found" });
            }

            const meeting = meetings[0];

            const userIds = new Set();
            if (meeting.host) userIds.add(meeting.host);
            if (meeting.minutetaker) userIds.add(meeting.minutetaker);


            let memberIds = [];
            try {
                let parsed = meeting.members;
                if (typeof parsed === "string") {
                    parsed = JSON.parse(parsed);
                }
                if (Array.isArray(parsed)) {
                    memberIds = parsed.map((id) => parseInt(id));
                    memberIds.forEach((id) => userIds.add(id));
                }
            } catch (err) {
                console.warn("Invalid members JSON, defaulting to []", err.message);
                memberIds = [];
            }


            const allUserIds = [...userIds];

            let userMap = {};
            if (allUserIds.length > 0) {
                const [users] = await db.query(
                    "SELECT user_id, username, email FROM users WHERE user_id IN (?)",
                    [allUserIds]
                );
                for (const u of users) {
                    userMap[u.user_id] = u;
                }
            }

            meeting.host = userMap[meeting.host] || null;
            meeting.minutetaker = userMap[meeting.minutetaker] || null;

            meeting.members = memberIds.map((id) => userMap[id] || { user_id: id, username: "Unknown User" });


            res.json(meeting);
        } catch (error) {
            console.error("Error fetching meeting by ID:", error);
            res.status(500).json({ message: "Error fetching meeting by ID" });
        }
    };


    endMeeting = async (req, res) => {
        try {
            const { meetingid } = req.params;
            console.log("Ending meeting with ID:", meetingid);
            const sql = `UPDATE meetings SET status = 'completed' WHERE meetingid = ?`;
            await db.query(sql, [meetingid])
            res.json({ message: "Meeting marked as completed" });
        } catch (error) {
            console.error("Error completing meeting:", error);
            res.status(500).json({ message: "Error completing meeting" });
        }
    }

    updateMeetingDetails = async (req, res) => {
        const { meetingid } = req.params;
        const {
            followup, title, mid, host, date, time,
            mode, venue, meet_link, description, minutetaker, members
        } = req.body;


        const host_id = host.user_id;
        const minutetaker_id = minutetaker.user_id;

        const sql = `UPDATE meetings SET followup=?, title=?, mid=?, host=?, minutetaker=?,
                    date=?, time=?, mode=?, venue=?, meet_link=?, description=?, members=? 
                    WHERE meetingid=?`;

        const values = [
            followup, title, mid, host_id, minutetaker_id,
            date, time, mode, venue, meet_link, description,
            JSON.stringify(members),
            meetingid
        ];

        try {
            await db.query(sql, values);
            res.send('Meeting details updated successfully');
        } catch (err) {
            console.error('Error updating meeting:', err);
            res.status(500).send('Failed to update meeting');
        }
    };

    getMembers = async (req, res) => {
        try {
            const { meetingid } = req.params;

            const [meetings] = await db.query(
                "SELECT members,mid FROM meetings WHERE meetingid = ?",
                [meetingid]
            );
            if (meetings.length === 0) {
                return res.status(404).json({ message: "Meeting not found" });
            }

            const meeting = meetings[0];
            const mid = meeting.mid;
            let memberIds = [];

            // Parse members JSON
            try {
                let parsed = meeting.members;
                if (typeof parsed === "string") {
                    parsed = JSON.parse(parsed);
                }
                if (Array.isArray(parsed)) {
                    memberIds = parsed.map((id) => parseInt(id));
                }
            } catch (err) {
                console.warn("Invalid members JSON, defaulting to []", err.message);
                memberIds = [];
            }
            if (memberIds.length === 0) {
                return res.json([]);
            }

            // 3. Fetch all users in one query
            const [users] = await db.query(
                "SELECT user_id, username, email FROM users WHERE user_id IN (?)",
                [memberIds]
            );

            // 4. Fetch all attendance rows for this meeting (ONE query)
            const [attendanceRows] = await db.query(
                "SELECT attendanceid, user_id, status FROM attendance WHERE meetingid = ?",
                [meetingid]
            );

            // Convert attendance rows into a fast lookup map
            const attendanceMap = {};
            attendanceRows.forEach(row => {
                attendanceMap[row.user_id] = row; // O(1) lookup
            });

            // 5. Merge users + attendance to final output
            const final = users.map(u => ({
                user_id: u.user_id,
                username: u.username,
                email: u.email,

                // if attendance exists → use it; else null + default status 0
                attendanceid: attendanceMap[u.user_id]?.attendanceid || null,
                status: attendanceMap[u.user_id]?.status || 0
            }));

            // 6. Return final merged list
            res.json(final);

        }
        catch (error) {
            console.error("Error fetching members:", error);
            res.status(500).json({ message: "Error fetching members" });
        }
    }

    updateAttendance = async (req, res) => {
        try {
            const { attendanceid, meetingid, user_id, status } = req.body;

            if (!meetingid || !user_id || status === undefined) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            if (attendanceid) {
                await db.query(
                    "UPDATE attendance SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE attendanceid = ?",
                    [status, attendanceid]
                );

                return res.json({
                    message: "Attendance updated",
                    attendanceid
                });
            }
            const [meeting] = await db.query(
                "SELECT mid, mode FROM meetings WHERE meetingid = ?",
                [meetingid]
            );

            if (meeting.length === 0) {
                return res.status(400).json({ message: "Invalid meetingid" });
            }

            const { mid, mode } = meeting[0];

            // Insert new attendance row
            const [insertRes] = await db.query(
                "INSERT INTO attendance (meetingid, mid, user_id, status, mode) VALUES (?, ?, ?, ?, ?)",
                [meetingid, mid, user_id, status, mode]
            );

            return res.json({
                message: "Attendance inserted",
                attendanceid: insertRes.insertId
            });

        } catch (error) {
            console.error("Error updating attendance:", error);
            res.status(500).json({ message: "Server error updating attendance" });
        }
    }

    getMeetingsByUser = async (req, res) => {
        try {
            const { user_id } = req.params;
            const [meetings] = await db.query(
                `SELECT * FROM meetings 
                 WHERE host = ? 
                    OR minutetaker = ? 
                    OR JSON_CONTAINS(members, JSON_ARRAY(?))`,
                [user_id, user_id, user_id]
            );
            res.json(meetings);
        }
        catch (error) {
            console.error("Error fetching meetings by user:", error);
            res.status(500).json({ message: "Error fetching meetings by user" });
        }
    }
}

module.exports = new meetingsController();