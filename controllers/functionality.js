const User = require('../models/User')
const Task = require('../models/Task')
const passport = require('passport')
const bcrypt = require('bcrypt')
const {
    v4: uuidv4
} = require('uuid');
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
    Task
        .find({
            userId: userId
        })
        .then(t => t)
        .then(t => {
            res.render(process.cwd() + '/public/pug/main.pug', {
                tasks: t
            })
        })
        .catch(err => err.status(500).json({
            message: "User does not exist!"
        }))
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
        req.body.password = bcrypt.hashSync(req.body.password, salt)
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

const addTask = asyncWrapper(async (req, res) => {
    if (req.body !== null) {
        let taskId = uuidv4()
        let userId = req.session.user_id
        req.body.userId = userId
        req.body.taskId = taskId
        const task = Task(req.body)
        task
            .save()
            .then(t => res.status(201).redirect('/main'))
            .catch(err => err.status(500).json({
                added: false
            }))
    } else {
        res.status(500).json({
            added: false
        })
    }
})

const deleteTask = asyncWrapper(async (req, res) => {
    let id = req.body.taskId
    if (id) {
        Task
            .deleteOne({
                taskId: id
            })
            .then(t => res.status(202))
    } else {
        res.status(500).json({
            deleted: false
        })
    }
})

const ensureAuthenticated = (req, res, next) => {
    if (req.session.user_id) {
        return next()
    } else {
        res.redirect('/')
    }
}

module.exports = {
    renderLoginPage,
    renderMainPage,
    renderRegister,
    doLogin,
    doLogOut,
    doGithubLogin,
    render404Page,
    doRegister,
    addTask,
    deleteTask,
    ensureAuthenticated
}