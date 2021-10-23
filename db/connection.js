const mongoose = require('mongoose')

const connectToDB = () => {
    return mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }, (err, db) => {
        if (err) {
            console.error(err)
            console.log(err.reason)
        } else {
            console.log('Connected correctly to MongoDB Atlas...')
        }
    })
}

module.exports = connectToDB