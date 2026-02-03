const db = require('../utils/connectdb');

class taskController {
    getMyTasks = async (req, res) => {
        try {
            const { user_id } = req.params;
            const query = `
            SELECT 
                t.*,
                u1.username AS assignby_name,
                u2.username AS assignto_name
            FROM tasks t
            LEFT JOIN users u1 ON t.assignby = u1.user_id
            LEFT JOIN users u2 ON t.assignto = u2.user_id
            WHERE t.assignto = ?
            ORDER BY 
                CASE 
                    WHEN t.status = 'assigned' THEN 1
                    WHEN t.status = 'pending' THEN 2
                    WHEN t.status = 'completed' THEN 3
                    ELSE 4
                END,
                t.date ASC;
        `;
            const [rows] = await db.query(query, [user_id]);
            res.status(200).json(rows);
        } catch (error) {
            console.error("Error fetching my tasks:", error);
            res.status(500).json({ message: "Error fetching my tasks" });
        }
    }

    getAssignedTasks = async (req, res) => {
        try {
            const { user_id } = req.params;
            const query = `
            SELECT 
                t.*,
                u1.username AS assignby_name,
                u2.username AS assignto_name
            FROM tasks t
            LEFT JOIN users u1 ON t.assignby = u1.user_id
            LEFT JOIN users u2 ON t.assignto = u2.user_id
            WHERE t.assignby = ?
            ORDER BY 
                CASE 
                    WHEN t.status = 'pending' THEN 1
                    WHEN t.status = 'assigned' THEN 2
                    WHEN t.status = 'completed' THEN 3
                    ELSE 4
                END,
                t.date ASC;
        `;
            const [rows] = await db.query(query, [user_id]);
            res.status(200).json(rows);
        }
        catch (error) {
            console.error("Error fetching assigned tasks:", error);
            res.status(500).json({ message: "Error fetching assigned tasks" });
        }
    }

    updateMyTask = async (req, res) => {
        try {
            const { taskid } = req.body;
            if (!taskid) {
                return res.status(400).json({ message: "taskid required" });
            }
            const sql = "update tasks set status=case when status='assigned' THEN 'pending' ELSE 'assigned' end where taskid = ?";
            const values = [taskid];
            await db.query(sql, values);
            res.status(200).json({ message: "Task status updated successfully" });
        } catch (error) {
            console.error("Error updating task status:", error);
            res.status(500).json({ message: "Error updating task status" });
        }
    }

    updateAssignedTask = async (req, res) => {
        try {
            const { taskid } = req.body;
            if (!taskid) {
                return res.status(400).json({ message: "taskid required" });
            }
            const sql = "update tasks set status=case when status='pending' THEN 'completed' ELSE 'pending' end where taskid = ?";
            const values = [taskid];
            await db.query(sql, values);
            res.status(200).json({ message: "Task status updated successfully" });
        } catch (error) {
            console.error("Error updating task status:", error);
            res.status(500).json({ message: "Error updating task status" });
        }
    }


}

module.exports = new taskController(); 