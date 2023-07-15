const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

async function registerUser(username, password){

    // Check if user exists
    const userExists = await this.findOne({ username });
    if(userExists)
        throw new Error('User already exists');

    // Hash password
    const salt = await bcrypt.genSalt(5);
    const hash = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await this.create({
        username,
        password: hash
    });

    return newUser;
}


UserSchema.statics.register = registerUser;

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;