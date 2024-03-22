const User = require('../models/User');

async function getAll(req, res) {
  try {
    const users = await User.find();
    if (!users) {
      res.status(404).json({msg: 'Users not found'});
      return;
    }

    res.status(200).json(users);
  
  } catch (error) {
    res.status(500).json({msg: error});
  }
}

async function getById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({msg: 'User not found'});
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({msg: error});
  }
}

async function deleteById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await User.deleteOne({ _id: user._id });
      res.status(200).json({msg: 'User deleted'});
    } else {
      res.status(404).json({msg: 'User not found'});
    }
  } catch (error) {
    res.status(500).json({msg: error});
  }
}

module.exports = {
  getAll,
  getById,
  deleteById
}