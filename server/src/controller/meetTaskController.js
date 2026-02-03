const db = require('../utils/connectdb');

class meetTaskController {
    getTaskMinutes = async (req, res) => {
        try {
            const { meetingid } = req.params;
            const sql = "SELECT * FROM minutes WHERE meetingid = ? AND istask = 1";
            const [rows] = await db.query(sql, [meetingid]);
            res.json(rows);
        }
        catch (error) {
            console.error("Error fetching task minutes:", error);
            res.status(500).json({ message: "Error fetching task minutes" });
        }
    }

    getTasks = async (req, res) => {
        try {
            const { meetingid } = req.params;
            const sql = `
                SELECT 
                    t.taskid,
                    t.meetingid,
                    t.minuteid,
                    t.task,
                    t.description,
                    t.date,
                    t.mid,

                    -- Assigned By details
                    t.assignby AS assignby_id,
                    ab.username AS assignby_name,
                    ab.email AS assignby_email,

                    -- Assigned To details
                    t.assignto AS assignto_id,
                    at.username AS assignto_name,
                    at.email AS assignto_email

                FROM tasks t
                LEFT JOIN users ab ON t.assignby = ab.user_id
                LEFT JOIN users at ON t.assignto = at.user_id
                WHERE t.meetingid = ?;
            `;
            const [rows] = await db.query(sql, [meetingid]);
            res.json(rows);
        }
        catch (error) {
            console.error("Error fetching tasks:", error);
            res.status(500).json({ message: "Error fetching tasks" });
        }
    }

    addTask = async (req, res) => {
        try {
            const { meetingid } = req.params;
            const { minuteid, task, desc, assignby, assignto, date, mid } = req.body;

            // Step 1: Insert into tasks table
            const insertQuery = `
                INSERT INTO tasks (meetingid, minuteid, task, description, assignby, assignto, date, mid)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const values = [meetingid, minuteid || null, task, desc, assignby, assignto, date, mid];
            await db.query(insertQuery, values);

            // Step 2: Update minute status only if minuteid exists
            if (minuteid) {
                const updateQuery = "UPDATE minutes SET status = 'assigned' WHERE minuteid = ?";
                await db.query(updateQuery, [minuteid]);
            }
            res.status(200).send("Task assigned successfully.");
        }
        catch (error) {
            console.error("Error assigning task:", error.message);
            res.status(500).send("Internal server error while assigning task.");
        }
    };


    deleteTask = async (req, res) => {
        try {
            const { meetingid, taskid } = req.params
            const sql = "DELETE FROM tasks WHERE taskid = ? AND meetingid = ?";
            await db.query(sql, [taskid, meetingid]);
            res.status(200).json({ message: "Task deleted successfully" });
        }
        catch (error) {
            console.error("Error deleting task:", error);
            res.status(500).json({ message: "Error deleting task" });
        }
    }

}

module.exports = new meetTaskController();