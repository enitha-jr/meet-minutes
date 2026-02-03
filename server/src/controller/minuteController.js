const db = require("../utils/connectdb");


class minuteController {

    addMinute = async (req, res) => {
        try{
            const { meetingid } = req.params;
            const { minute, istask, mid } = req.body;
            const sql = "INSERT INTO minutes (meetingid, minute, istask, mid) VALUES (?, ?, ?, ?)";
            const values = [meetingid, minute, istask, mid];
            const [result] = await db.query(sql, values);
            res.json({ minuteid: result.insertId, meetingid, minute, istask, mid });
        }
        catch(error){
            console.error("Error adding minute:", error);
            res.status(500).json({ message: "Error adding minute" });
        }
    }

    getMinutes = async (req, res) => {
        try{
            const { meetingid } = req.params;
            const sql = "SELECT * FROM minutes WHERE meetingid = ?";
            const [rows] = await db.query(sql, [meetingid]);
            res.json(rows);
        }
        catch(error){
            console.error("Error fetching minutes:", error);
            res.status(500).json({ message: "Error fetching minutes" });
        }
    }

    deleteMinute = async (req, res) => {
        try{
            const values = [req.params.minuteid, req.params.meetingid];
            const sql = "DELETE FROM minutes WHERE minuteid = ? AND meetingid = ?";
            await db.query(sql, values);
            res.status(200).json({ message: "Minute deleted successfully" });
        }
        catch(error){
            console.error("Error deleting minute:", error);
            res.status(500).json({ message: "Error deleting minute" });
        }
    }

    getSingleMinute = async (req, res) => {
        try{
            const { meetingid, minuteid } = req.params;
            const sql = "SELECT * FROM minutes WHERE meetingid = ? AND minuteid = ?";
            const values = [meetingid, minuteid];
            const [rows] = await db.query(sql, values);
            res.json(rows[0]);
        }
        catch(error){
            console.error("Error fetching single minute:", error);
            res.status(500).json({ message: "Error fetching single minute" });
        }
    }

    updateMinute = async(req,res) => {
        try{
            const {meetingid, minuteid} = req.params;
            const {minute} = req.body;
            const values = [minute,meetingid,minuteid];
            const sql = "update minutes set minute = ? where meetingid=? and minuteid=?"
            await db.query(sql,values);
            res.send("Minute updated sucessfulyy");
        }catch (err) {
            console.error('Error updating minute:', err);
            res.status(500).send('Failed to update minute');
        }
    }
}



module.exports = new minuteController();