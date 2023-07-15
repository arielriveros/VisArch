const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Create Token
function CreateToken(id, username) {
    return jwt.sign(
        { id, username },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
    )
}

// Register user
async function RegisterUser(req, res) {
    const { username, email, password } = req.body;

    try {
        const newUser = await User.register(username, email, password);

        // Create token
        const token = CreateToken(newUser._id, newUser.username);

        res.status(200).json({"user": username, "token:": token});
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