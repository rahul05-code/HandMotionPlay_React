const db = require('../db/connection');

const getAdminDashboardStats = async (req, res) => {
    try {
        // Total Users
        const totalUsersRes = await db.query('SELECT COUNT(*) FROM users');
        const totalUsers = parseInt(totalUsersRes.rows[0].count);

        // Active Users
        const activeUsersRes = await db.query('SELECT COUNT(*) FROM users WHERE is_active = true');
        const activeUsers = parseInt(activeUsersRes.rows[0].count);

        // Total Sessions
        const totalSessionsRes = await db.query('SELECT COUNT(*) FROM game_sessions');
        const totalSessions = parseInt(totalSessionsRes.rows[0].count);

        // Average Session Time
        const avgSessionRes = await db.query('SELECT AVG(time_spent) FROM game_sessions');
        const avgSessionTime = parseFloat(avgSessionRes.rows[0].avg || 0);

        // Total Platform Score (sum across all sessions)
        const totalScoreRes = await db.query('SELECT SUM(score) FROM game_sessions');
        const totalScore = parseInt(totalScoreRes.rows[0].sum || 0);

        // Weekly Activity (last 7 days grouped by day)
        const weeklyActivityRes = await db.query(`
            SELECT 
                to_char(created_at, 'Dy') as day,
                COUNT(session_id) as activity,
                AVG(accuracy) as accuracy
            FROM game_sessions
            WHERE created_at >= NOW() - INTERVAL '7 days'
            GROUP BY to_char(created_at, 'Dy'), date(created_at)
            ORDER BY date(created_at) ASC
        `);

        // If there is no activity, provide dummy data matching frontend structure to prevent visual breakage
        let userGrowthData = weeklyActivityRes.rows.map(row => ({
            day: row.day,
            activity: parseInt(row.activity),
            accuracy: parseFloat(row.accuracy || 0).toFixed(1)
        }));

        if (userGrowthData.length === 0) {
            userGrowthData = [...Array(7).fill(0).map((_, i) => ({
              day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
              activity: 0,
              accuracy: 0
            }))];
        }

        res.json({
            summary: {
                totalUsers,
                activeUsers,
                totalSessions,
                avgSessionTime: (avgSessionTime / 60).toFixed(1) + ' min', // Convert to minutes
                totalScore: totalScore > 1000000 ? (totalScore / 1000000).toFixed(1) + 'M' : totalScore > 1000 ? (totalScore / 1000).toFixed(1) + 'K' : totalScore.toString()
            },
            chartData: userGrowthData
        });

    } catch (error) {
        console.error('Error fetching admin dashboard stats:', error);
        res.status(500).json({ message: 'Server error fetching admin dashboard stats' });
    }
};

module.exports = { getAdminDashboardStats };
