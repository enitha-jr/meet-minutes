const db = require("../utils/connectdb");
const { JWT_SECRET } = require('../config/config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class authController {

    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            // console.log('Login attempting');
            const sql = "SELECT * FROM users WHERE email = ?";
            const result = await db.query(sql, [email]);
            // console.log('Database query result:', result);
            if (result.length === 0) {
                return res.status(400).json({ message: 'Invalid' });
            }
            const user = result[0][0];

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid' });
            }
            const token = jwt.sign({
                user_id: user.user_id,
                username: user.username,
                email: user.email,
            }, JWT_SECRET, { expiresIn: '1h' });

            const decoded = jwt.verify(token, JWT_SECRET);
            res.json({ token: token, user_id: user.user_id, username: user.username, email: user.email, exp: decoded.exp });
        }
        catch (error) {
            console.error('Error during login:', error);
            return res.status(500).json({ error: "Unable to login", message: error.message });
        }
    }

    register = async (req, res) => {
        try {
            // console.log('Registering user:', req.body);
            const { username, password, email} = req.body;
            const salt = await bcrypt.genSalt(10)
            // console.log('Salt generated:', salt);
            const hashedPassword = await bcrypt.hash(password, salt);
            console.log('Hashed password:', hashedPassword);
            const sql = "INSERT INTO users (username, email, password) VALUES ( ?, ?, ?)";
            await db.query(sql, [username, email, hashedPassword]);
            res.send("User created successfully")
        } catch (error) {
            console.error('Error during registration:', error);
            res.status(500).json({ error: "Unable to register", message: error.message })
        }
    }
    getUser = async (req, res) => {
        try{
            // console.log('Fetching user details for userId:', req.params.userId);
            const userId = req.params.userId;
            const query = "select * from users where user_id = ?";
            const [result] = await db.query(query, [userId]);
            if (result.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            const user = result[0];
            res.json({
                user_id: user.user_id,
                username: user.username,
                email: user.email,  
            });
        } catch (error) {
            res.status(500).json({error: "Server Error", message: error.message})
        }
    }

    getAllUsers = async (req, res) => {
        try{
            // console.log("Fetching all users");
            const sql = "SELECT user_id, username, email FROM users";
            const [rows] = await db.query(sql);
            res.json(rows);
        }
        catch(error){
            console.error("Error fetching users:", error);
            res.status(500).json({ message: "Error fetching users" });
        }
    }
}

module.exports = new authController();