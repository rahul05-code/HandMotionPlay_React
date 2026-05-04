const pool = require('../db/connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const adminLoginQuery = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetch admin by email only
        const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const admin = result.rows[0];

        // Compare provided password with the stored hash
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const payload = {
            user: {
                id: admin.admin_id,
                email: admin.email,
                role: admin.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({ message: 'Admin Login successful', token, user: admin });
            }
        );
    } catch (error) {
        console.error('Admin Login error:', error);
        res.status(500).json({ message: 'Database error' });
    }
};

module.exports = adminLoginQuery;
