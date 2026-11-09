const userModel = require('../models/userModel');

async function renderUserList(req, res) {
    try {
        const users = await userModel.getAllUsers();
        res.render('users/index', { users });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

async function createUser(req, res) {
    try {
        await userModel.createUser(req.body);
        res.redirect('/users');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

async function updateUser(req, res) {
    try {
        const userId = req.params.id;
        await userModel.updateUser(userId, req.body);
        res.redirect('/users');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

async function deleteUser(req, res) {
    try {
        const userId = req.params.id;
        await userModel.deleteUser(userId);
        res.redirect('/users');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

module.exports = {
    renderUserList,
    createUser,
    updateUser,
    deleteUser
};