const db = require('../config/db');

async function getAllUsers() {
    const [rows] = await db.query('SELECT * FROM users');
    return rows;
}

async function getUserById(id) {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
}

async function createUser(userData) {
    const { username, password, role, farm_id } = userData;
    const [result] = await db.query(
        'INSERT INTO users (username, password, role, farm_id) VALUES (?, ?, ?, ?)',
        [username, password, role, farm_id]
    );
    return result.insertId;
}

async function updateUser(id, userData) {
    const { username, role, farm_id } = userData;
    await db.query(
        'UPDATE users SET username = ?, role = ?, farm_id = ? WHERE id = ?',
        [username, role, farm_id, id]
    );
}

async function deleteUser(id) {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
