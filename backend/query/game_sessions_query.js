const db = require('../db/connection');

const saveGameSession = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { gameName, score, accuracy, time_spent, attempts } = req.body;

        if (!gameName) {
            return res.status(400).json({ error: 'gameName is required' });
        }

        // 1. Get Game ID - Flexible spacing check
        const gameRes = await db.query(
            `SELECT game_id FROM games 
             WHERE TRIM(REGEXP_REPLACE(game_name, '\\s+', ' ', 'g')) = TRIM(REGEXP_REPLACE($1, '\\s+', ' ', 'g')) 
             LIMIT 1`, [gameName]
        );
        if (gameRes.rows.length === 0) {
            return res.status(404).json({ error: `Game not found: ${gameName}` });
        }
        const gameId = gameRes.rows[0].game_id;

        // 2. Insert Game Session
        const insertSessionQuery = `
            INSERT INTO game_sessions (user_id, game_id, score, accuracy, time_spent, attempts)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING session_id;
        `;
        const sessionRes = await db.query(insertSessionQuery, [
            userId, gameId, score || 0, accuracy || 0, time_spent || 0, attempts || 1
        ]);

        // 3. Update Progress Tracking Table (Upsert pattern)
        const progressStatsRes = await db.query(
            `SELECT COUNT(session_id) as total_games_played, 
                    COALESCE(SUM(time_spent), 0) as total_time_spent, 
                    COALESCE(AVG(accuracy), 0) as average_accuracy 
             FROM game_sessions WHERE user_id = $1`,
            [userId]
        );

        const currentProgRes = await db.query('SELECT progress_id FROM progress_tracking WHERE user_id = $1', [userId]);

        const stats = progressStatsRes.rows[0];

        if (currentProgRes.rows.length > 0) {
            // Update
            await db.query(`
                UPDATE progress_tracking 
                SET total_games_played = $1, total_time_spent = $2, average_accuracy = $3, last_updated = NOW()
                WHERE user_id = $4
            `, [stats.total_games_played, stats.total_time_spent, stats.average_accuracy, userId]);
        } else {
            // Insert
            await db.query(`
                INSERT INTO progress_tracking (user_id, total_games_played, total_time_spent, average_accuracy)
                VALUES ($1, $2, $3, $4)
            `, [userId, stats.total_games_played, stats.total_time_spent, stats.average_accuracy]);
        }

        res.json({ message: 'Session saved successfully', session_id: sessionRes.rows[0].session_id });
    } catch (error) {
        console.error('Error saving game session:', error);
        res.status(500).json({ message: 'Server error saving game session' });
    }
};

module.exports = { saveGameSession };
