const pool = require('../db/connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const loginQuery = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetch user by email only (not password, since it's hashed)
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = result.rows[0];

        // Check if the user's account is active
        if (user.is_active === false) {
            return res.status(403).json({ message: 'Your account has been deactivated by the admin. Please contact support.' });
        }

        // Compare provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const payload = {
            user: {
                id: user.user_id,
                email: user.email
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({ message: 'Login successful', token, user });
            }
        );
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Database error' });
    }
};

module.exports = loginQuery;