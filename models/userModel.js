const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name.']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email adress.']
    },
    //photo: String,
    password: { 
        type: String,
        required: [true,'Please provide a password.'],
        minLength: 5,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password.'],
        validate: {
            //only works on CREATE AND SAVE
            validator: function(el) { 
                return el === this.password
            },
            message: ' The passwords are not the same.'
        }
    }
});

userSchema.pre('save', async function(next) {
     //only runs this function if password was modified
    if (!this.isModified('password')) return next();
    
    // hashing the password
    this.password = await bcrypt.hash(this.password, 12);

    // delete passwordConfirm file
    this.passwordConfirm = undefined;
    next();
   
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;