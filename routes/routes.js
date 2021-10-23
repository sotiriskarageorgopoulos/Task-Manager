const express = require('express')
const passport = require('passport')
const router = express.Router()
const {
    renderLoginPage,
    renderMainPage,
    doLogin,
    doLogOut,
    renderRegister,
    doGithubLogin,
    doRegister,
    addTask,
    deleteTask,
    ensureAuthenticated
} = require('../controllers/functionality')

router.route('/')
    .get(renderLoginPage)

router.route('/login')
    .post(passport.authenticate('local', {
        failureRedirect: '/'
    }), doLogin)

router.route('/auth/github/callback')
    .get(passport.authenticate('github', {
        failureRedirect: '/'
    }), doGithubLogin)

router.route('/auth/github')
    .get(passport.authenticate('github'))

router.route('/main')
    .get(ensureAuthenticated,renderMainPage)
    .post(addTask)
    .delete(deleteTask)

router.route('/logout')
    .get(doLogOut)

router.route('/register')
    .get(renderRegister)
    .post(doRegister)
module.exports = router