const pool = require('../db/connection');

const getUsersQuery = (req, res) => {
    pool.query('SELECT (name,email,age,gender,is_active,created_at) FROM users', (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database error' });
        } else {
            res.status(200).json(results.rows);
        }
    });
}

const showUserQuery = (req, res) => {
    const { email } = req.params;

    pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database error' });
        } else if (results.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(200).json(results.rows[0]);
        }
    });
}

const updateUserQuery = (req, res) => {
    const email = req.user.email; // From auth middleware JWT payload
    const { name, age, gender, hand_type, therapy_type } = req.body;

    // Convert age to integer or null if empty/not a number
    const ageInt = age !== '' && age !== null && age !== undefined ? parseInt(age, 10) : null;

    pool.query(
        'UPDATE users SET name = $1, age = $2, gender = $3, hand_type = $4, therapy_type = $5, updated_at = NOW() WHERE email = $6 RETURNING *',
        [name || null, ageInt, gender || null, hand_type || null, therapy_type || null, email],
        (error, results) => {
            if (error) {
                console.error("Profile update SQL error:", error.message);
                res.status(500).json({ error: 'Database error: ' + error.message });
            } else if (results.rows.length === 0) {
                res.status(404).json({ error: 'User not found to update' });
            } else {
                res.status(200).json({ message: 'Profile updated successfully', user: results.rows[0] });
            }
        }
    );
};

module.exports = {
    getUsersQuery,
    showUserQuery,
    updateUserQuery
};