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
    const { id } = req.params;

    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
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
    const userId = req.user.id; // From auth middleware
    const { name, age, gender, hand_type, therapy_type } = req.body;

    pool.query(
        'UPDATE users SET name = $1, age = $2, gender = $3, hand_type = $4, therapy_type = $5, updated_at = NOW() WHERE user_id = $6 RETURNING *',
        [name, age, gender, hand_type, therapy_type, userId],
        (error, results) => {
            if (error) {
                console.error("Profile update error:", error);
                res.status(500).json({ error: 'Database error while updating profile' });
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