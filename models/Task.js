const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    taskId: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Task', TaskSchema)