const User = require('../models/User')
const Task = require('../models/Task')
const passport = require('passport')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid');
const asyncWrapper = require('../middleware/asyncWrapper')

const renderLoginPage = asyncWrapper(async (req, res) => {
    res.render(process.cwd() + '/public/pug/login.pug')
})

const doLogOut = asyncWrapper(async (req, res) => {
    req.logout()
    res.redirect('/')
})

const renderMainPage = asyncWrapper(async (req, res) => {
    let userId = req.session.user_id
    User
    .findOne({id:userId})
    .then(u => {
        res.render(process.cwd() + '/public/pug/main.pug',{name: u.name})
    })
    .catch(err => err.status(500).json({message:"User does not exist!"}))
})

const doLogin = asyncWrapper(async (req, res) => {
    req.session.user_id = req.user.id
    res.redirect('/main')
})

const render404Page = asyncWrapper(async (req, res, next) => {
    res
        .status(404)
        .render(process.cwd() + '/public/pug/error404.pug')
})

const renderRegister = asyncWrapper(async (req, res) => {
    res.render(process.cwd() + '/public/pug/register.pug')
})

const doGithubLogin = asyncWrapper(async (req, res) => {
    req.session.user_id = req.user.id
    res.redirect('/main');
})

const doRegister = asyncWrapper(async (req, res) => {
    if (req.body !== null) {
        const salt = bcrypt.genSaltSync(10)
        req.body.password = bcrypt.hashSync(req.body.password,salt)
        req.body.id = uuidv4()
        const user = User(req.body)
        user
            .save()
            .then(u => res.status(201).redirect('/register'))
            .catch(err => res.status(500).json({
                registered: false,
                err
            }))
    } else {
        res.json({
            registered: false
        })
    }
})

const ensureAuthenticated = () => {
    //TODO: ΟΤΑΝ ΤΕΛΕΙΩΣΩ ME TO main.pug ΑΡΧΕΙΟ
}

module.exports = {
    renderLoginPage,
    renderMainPage,
    renderRegister,
    doLogin,
    doLogOut,
    doGithubLogin,
    render404Page,
    doRegister
}