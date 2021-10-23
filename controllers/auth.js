const passport = require('passport')
const bcrypt = require('bcrypt')
const GithHubStrategy = require('passport-github').Strategy
const LocalStrategy = require('passport-local')
const ObjectId = require('mongodb').ObjectId
const User = require('../models/User')

const deserialize = () => {
    passport.deserializeUser((user, done) => {
        User
            .findOne({
                _id: new ObjectId(user._id)
            }, (err, doc) => done(null, doc))
    })
}
const serialize = () => {
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
}

const localStrategy = new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    (username, password, done) => {
        User
            .findOne({
                email: username
            }, (err, user) => {
                if (err) {
                    return done(err)
                }
                if (!user) {
                    return done(null, false)
                }
                if (!bcrypt.compareSync(password, user.password)) {
                    return done(null, false)
                }
                return done(null, user)
            })
    })

const githubStrategy = new GithHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
}, (accessToken, refreshToken, profile, cb) => {
    let profileObj = {
        id: profile.id,
        name: profile.displayName,
        email: Array.isArray(profile.emails) ? profile.emails[0].value : 'Do not exist email!',
        password: '',
        tel: ''
    }
    User.findOne({
            id: profileObj.id
        })
        .then(u => {
            if (!u) {
                const user = User(profileObj)
                user.save((err, doc) => {
                    if (err) return console.error(err)
                    cb(null, doc)
                })
            }
            cb(null, u)
        })
        .catch(err => err.status(500).json({
            message: "Error on authentication of user!"
        }))
})

module.exports = {
    serialize,
    deserialize,
    localStrategy,
    githubStrategy
}