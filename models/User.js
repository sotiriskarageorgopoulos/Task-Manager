const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    tel: {
        type: String,
    }
})

module.exports = mongoose.model('User', UserSchema)