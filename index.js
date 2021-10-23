require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes/routes')
const connectToDB = require('./db/connection')
const {render404Page} = require('./controllers/functionality')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const {
    serialize,
    deserialize,
    localStrategy,
    githubStrategy
} = require('./controllers/auth')
const app = express()
const http = require('http').createServer(app)
const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URI
})

app.set('view-engine', 'pug')
app.use('/public', express.static(process.cwd() + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false
    },
    key: 'express.sid',
    store: store
}))
app.use(passport.initialize())
app.use(passport.session({}))

serialize()
deserialize()
passport.use(localStrategy)
passport.use(githubStrategy)

app.use('', routes)
app.use(render404Page)

const start = async () => {
    try {
        const port = process.env.PORT || 3000
        await connectToDB()
        http.listen(port, () => {
            console.log(`Server is listening on port ${port}...`)
        })
    } catch (e) {
        console.error(e)
    }
}

start()