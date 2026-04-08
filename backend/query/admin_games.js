const pool = require('../db/connection');
const crypto = require('crypto');

// Get all games for admin (shows both active and inactive)
const getAllGamesAdmin = async (req, res) => {
    try {
        // Ensure the columns exist gracefully if not already present
        await pool.query('ALTER TABLE games ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true');
        await pool.query('ALTER TABLE games ADD COLUMN IF NOT EXISTS benefits TEXT');
        
        const result = await pool.query('SELECT * FROM games ORDER BY created_at ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching admin games:", error);
        res.status(500).json({ error: 'Database error' });
    }
};

// Toggle game active status
const toggleGameStatus = async (req, res) => {
    const { id } = req.params;
    const { is_active } = req.body;
    try {
        const result = await pool.query(
            'UPDATE games SET is_active = $1 WHERE game_id = $2 RETURNING *',
            [is_active, id]
        );
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error toggling game:", error);
        res.status(500).json({ error: 'Database error' });
    }
};

// Add a new game
const addGame = async (req, res) => {
    const { game_name, description, difficulty_level, category, benefits } = req.body;
    try {
        await pool.query('ALTER TABLE games ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true');
        await pool.query('ALTER TABLE games ADD COLUMN IF NOT EXISTS benefits TEXT');
        const generatedId = crypto.randomUUID();

        const result = await pool.query(
            'INSERT INTO games (game_id, game_name, description, difficulty_level, category, benefits, created_at, is_active) VALUES ($1, $2, $3, $4, $5, $6, NOW(), true) RETURNING *',
            [generatedId, game_name, description, difficulty_level, category, benefits]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error adding game:", error);
        res.status(500).json({ error: 'Database error' });
    }
};

// Edit game
const editGame = async (req, res) => {
    const { id } = req.params;
    const { game_name, description, difficulty_level, category, benefits } = req.body;
    try {
        await pool.query('ALTER TABLE games ADD COLUMN IF NOT EXISTS benefits TEXT');
        const result = await pool.query(
            'UPDATE games SET game_name = $1, description = $2, difficulty_level = $3, category = $4, benefits = $5 WHERE game_id = $6 RETURNING *',
            [game_name, description, difficulty_level, category, benefits, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Game not found' });
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error editing game:", error);
        res.status(500).json({ error: 'Database error' });
    }
};

// Delete game
const deleteGame = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM games WHERE game_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Game not found' });
        res.status(200).json({ message: 'Game deleted successfully' });
    } catch (error) {
        console.error("Error deleting game:", error);
        res.status(500).json({ error: 'Database error' });
    }
};

module.exports = { getAllGamesAdmin, toggleGameStatus, addGame, editGame, deleteGame };
