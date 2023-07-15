const User = require('../models/User');

// Register user
async function RegisterUser(req, res) {
    const { username, password } = req.body;

    try {
        const newUser = await User.register(username, password);
        res.status(200).json(newUser);
    } catch (error) {
        res.status(400).json({
            msg: error.message
        });
    }
}

// Login user
async function LoginUser(req, res) {
    res.json({
        msg: 'Login user'
    });
}

module.exports = {
    LoginUser,
    RegisterUser
}