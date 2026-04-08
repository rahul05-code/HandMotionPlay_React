const pool = require('../db/connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const adminRegisterQuery = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if admin already exists
        const existing = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Admin email already registered' });
        }

        // Hash the password with salt rounds of 10
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const adminName = name || 'Admin User';

        // Insert new admin with hashed password
        const result = await pool.query(
            'INSERT INTO admins (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [adminName, email, hashedPassword, 'admin']
        );

        const admin = result.rows[0];
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
                res.status(201).json({ message: 'Admin Register successful', token, user: admin });
            }
        );
    } catch (error) {
        console.error('Admin Register error:', error);
        res.status(500).json({ error: 'Database error' });
    }
};

module.exports = adminRegisterQuery;
