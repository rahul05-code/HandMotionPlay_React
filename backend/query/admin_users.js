const pool = require('../db/connection');

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: 'Database error' });
    }
};

// Update user details
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, age, gender, hand_type, therapy_type, status } = req.body;
    
    // Convert status to boolean
    const is_active = status === 'active' || status === true;
    const ageInt = age !== '' && age !== null && age !== undefined ? parseInt(age, 10) : null;

    try {
        const result = await pool.query(
            `UPDATE users 
             SET name = $1, email = $2, age = $3, gender = $4, hand_type = $5, therapy_type = $6, is_active = $7, updated_at = NOW() 
             WHERE user_id = $8 RETURNING *`,
            [name || null, email, ageInt, gender || null, hand_type || null, therapy_type || null, is_active, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', user: result.rows[0] });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: 'Database error' });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM users WHERE user_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: 'Database error' });
    }
};

module.exports = {
    getAllUsers,
    updateUser,
    deleteUser
};
