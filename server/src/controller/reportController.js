const db = require('../utils/connectdb');

class reportController {

    getAllTasks = async (req, res) => {
        try {
            const { meetingid } = req.params;

            const sql = `
                SELECT 
                    t.*,
                    u1.username AS assignby_name,
                    u2.username AS assignto_name
                FROM tasks t
                LEFT JOIN users u1 ON t.assignby = u1.user_id
                LEFT JOIN users u2 ON t.assignto = u2.user_id
                WHERE t.meetingid = ?
                ORDER BY 
                    CASE 
                        WHEN t.status = 'assigned' THEN 1
                        WHEN t.status = 'pending' THEN 2
                        WHEN t.status = 'completed' THEN 3
                        ELSE 4
                    END,
                    t.date ASC;
            `;

            const [rows] = await db.query(sql, [meetingid]);
            res.status(200).json(rows);

        } catch (error) {
            console.error("Error fetching all tasks:", error);
            res.status(500).json({ message: "Server error fetching tasks" });
        }
    }

    getNotAssignedTasks = async (req, res) => {
        try {
            const { meetingid } = req.params;

            const sql = `
                SELECT *
                FROM minutes m
                WHERE m.meetingid = ?
                  AND m.istask = 1
                  AND NOT EXISTS (SELECT 1 FROM tasks t WHERE t.minuteid = m.minuteid)
            `;

            const [rows] = await db.query(sql, [meetingid]);
            res.status(200).json(rows);

        } catch (error) {
            console.error("Error fetching unassigned tasks:", error);
            res.status(500).json({ message: "Server error fetching unassigned tasks" });
        }
    }

    getToBeDiscussed = async (req, res) => {
        try {
            const { mid } = req.params;  
            const sql = `
                SELECT 
                    t.*,
                    u1.username AS assignby_name,
                    u2.username AS assignto_name
                FROM tasks t
                LEFT JOIN users u1 ON t.assignby = u1.user_id
                LEFT JOIN users u2 ON t.assignto = u2.user_id
                WHERE t.mid = ?
                  AND (
                        t.status != 'completed' OR
                        (t.status = 'completed' AND t.meetingid = (
                            SELECT MAX(meetingid) FROM tasks WHERE mid = ?
                        ))
                      )
                ORDER BY 
                    CASE 
                        WHEN t.status = 'assigned' THEN 1
                        WHEN t.status = 'pending' THEN 2
                        WHEN t.status = 'completed' THEN 3
                        ELSE 4
                    END,
                    t.date ASC
            `;

            const [rows] = await db.query(sql, [mid, mid]);
            // console.log("Fetched to be discussed tasks:", rows);
            res.json(rows);

        } catch (error) {
            console.error("Error fetching to be discussed tasks:", error);
            res.status(500).json({ message: "Error fetching to be discussed tasks" });
        }
    };

    getToBeNotAssigned = async (req, res) => {
        try {
            const { mid } = req.params;

            const sql = `
                SELECT m.*
                FROM minutes m
                WHERE m.mid = ?
                  AND m.istask = 1
                  AND NOT EXISTS (
                        SELECT 1 FROM tasks t 
                        WHERE t.minuteid = m.minuteid
                  )
            `;

            const [rows] = await db.query(sql, [mid]);
            res.json(rows);

        } catch (error) {
            console.error("Error fetching unassigned tasks:", error);
            res.status(500).json({ message: "Error fetching unassigned tasks" });
        }
    };

}

module.exports = new reportController();
