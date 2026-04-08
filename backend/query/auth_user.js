const pool = require('../db/connection');

const authUserQuery = (req, res) => {
    // req.user is set by authMiddleware (contains id & email from JWT)
    const email = req.user.email;

    pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
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
