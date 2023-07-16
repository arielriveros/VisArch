const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = async (req, res, next) => {

    const { authorization } = req.headers;

    if (!authorization)
        return res.status(401).json({ error: 'You must be logged in.' });

    const token = authorization.replace('Bearer ', '');

    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(id).select('_id');
        next();
    } catch (err) {
        return res.status(401).json({ error: 'You must be logged in.' });
    }
}

module.exports = requireAuth;