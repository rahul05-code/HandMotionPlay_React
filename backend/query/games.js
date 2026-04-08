const pool = require('../db/connection');

// Get active games for user library
const getActiveGames = async (req, res) => {
    try {
        // Ensure column exists gracefully
        await pool.query('ALTER TABLE games ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true');
        await pool.query('ALTER TABLE games ADD COLUMN IF NOT EXISTS benefits TEXT');
        
        // Only return games that are active
        const result = await pool.query('SELECT * FROM games WHERE is_active = true ORDER BY created_at ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching user games:", error);
        res.status(500).json({ error: 'Database error' });
    }
};

module.exports = getActiveGames;
