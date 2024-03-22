
const requireAuth = async (req, res, next) => {
  try {
    if (req.user)
      next();
    else
      throw new Error('You must be logged in.');

  } catch (err) {
    res.status(401).json({ error: 'You must be logged in.' });
  }
}

module.exports = requireAuth;