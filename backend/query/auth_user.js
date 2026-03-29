const pool = require('../db/connection');

const authUserQuery = (req, res) => {
    // req.user is set by authMiddleware
    const userId = req.user.id;

    pool.query('SELECT * FROM users WHERE user_id = $1', [userId], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Database error' });
        }
        
        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user: results.rows[0] });
    });
};

module.exports = authUserQuery;
