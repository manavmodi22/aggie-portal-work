const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: [true, 'first name is required'],
        trim: true,
        max: 32,
    },
    lastName:{
        type: String,
        required: [true, 'last name is required'],
        trim: true,
        max: 32,
    },
    email:{
        type: String,
        required: [true, 'email is required'],
        trim: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email'],
        max: 32,
    },
    password:{
        type: String,
        required: [true, 'password is required'],
        trim: true,
        min: [6,'password must be at least 6 characters long'],
        max: 32,
    },
    role: {
        type: String,
        default: 0,
    },
},{timestamps: true});

//encrypting password

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password, 12);
})

module.exports = mongoose.model('User', userSchema);