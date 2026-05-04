const db = require('../db/connection');

const getUserProgress = async (req, res) => {
    try {
        const userId = req.user.user_id;

        // 1. Get overall progress stats
        const progressRes = await db.query(
            'SELECT * FROM progress_tracking WHERE user_id = $1',
            [userId]
        );

        let overallStats = {
            total_games_played: 0,
            total_time_spent: 0,
            average_accuracy: 0,
            improvement_rate: 0
        };

        if (progressRes.rows.length > 0) {
            overallStats = progressRes.rows[0];
        } else {
            // Fallback, calculate manually if progress_tracking isn't populated
        const aggRes = await db.query(
            `SELECT 
                COUNT(session_id) as total_games_played, 
                COALESCE(SUM(time_spent), 0) as total_time_spent, 
                COALESCE(AVG(accuracy), 0) as average_accuracy,
                COALESCE(SUM(score), 0) as total_score
            FROM game_sessions WHERE user_id = $1`,
            [userId]
        );
        
        if (aggRes.rows[0]) {
            overallStats.total_games_played = parseInt(aggRes.rows[0].total_games_played);
            overallStats.total_time_spent = parseInt(aggRes.rows[0].total_time_spent);
            overallStats.average_accuracy = parseFloat(aggRes.rows[0].average_accuracy);
            overallStats.total_score = parseInt(aggRes.rows[0].total_score);
        }
        } // close the else block

        // 2. Get recent game sessions for chart data (last 10 sessions)
        const sessionsRes = await db.query(
            `SELECT 
                gs.session_id, gs.score, gs.accuracy, gs.time_spent, gs.created_at, g.game_name 
            FROM game_sessions gs 
            JOIN games g ON gs.game_id = g.game_id 
            WHERE gs.user_id = $1 
            ORDER BY gs.created_at DESC 
            LIMIT 50`,
            [userId]
        );

        const recentSessions = sessionsRes.rows.slice(0, 10).map(row => ({
            id: row.session_id,
            date: new Date(row.created_at).toLocaleDateString(),
            game: row.game_name,
            score: row.score,
            accuracy: row.accuracy,
            time: row.time_spent,
            rawDate: row.created_at
        }));

        const chartData = sessionsRes.rows.map(row => ({
            date: new Date(row.created_at).toLocaleDateString(),
            score: row.score,
            accuracy: row.accuracy,
            game: row.game_name
        })).reverse();

        res.json({
            stats: overallStats,
            chartData: chartData,
            recentSessions: recentSessions,
            allData: sessionsRes.rows
        });

    } catch (error) {
        console.error('Error fetching user progress:', error);
        res.status(500).json({ message: 'Server error fetching user progress' });
    }
};

module.exports = { getUserProgress };
