const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    }
});

async function registerUser(username, email, password){

    // Validation
    if (!username || !password)
        throw new Error('Username and Password fields are required');

    if (!validator.isEmail(email) && email)
        throw new Error('Invalid email');

    if (!validator.isLength(password, { min: 6 }))
        throw new Error('Password must be at least 6 characters long');

    const userExists = await this.findOne({ username });
    if(userExists)
        throw new Error('User already exists');

    const emailLinked = await this.findOne({ email });
    if(emailLinked && email)
        throw new Error('Email already linked to another account');

    // Hash password
    const salt = await bcrypt.genSalt(5);
    const hash = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await this.create({
        username,
        email,
        password: hash
    });

    return newUser;
}


UserSchema.statics.register = registerUser;

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;