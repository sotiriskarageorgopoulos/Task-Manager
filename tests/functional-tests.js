const chai = require('chai')
const chaiHTTP = require('chai-http')
const server = require('../index')
const assert = chai.assert
chai.use(chaiHTTP)

suite('Functional Tests', () => {
    suite('Register a user', () => {
        test('Register correctly a user!', async () => {
            chai
                .request(server)
                .post('/register')
                .send({
                    name: "John Brown",
                    email: "jb@domain.com",
                    password: "123",
                    tel: "6278181818"
                })
                .end((err, res) => {
                    assert.equal(200, res.status, 'Response status should be 200.')
                })
        })

        test('Register wrongfully a user!', async () => {
            chai
                .request(server)
                .post('/register')
                .send({
                    email: "jb@domain.com",
                    password: "123"
                })
                .end((err, res) => {
                    assert.equal(500, res.status, 'Response status should be 500, because tel and name are missing!')
                })
        })
    })

    suite('Login a user', () => {
        test('Login successfully a user', async () => {
            chai
                .request(server)
                .post('/login')
                .send({
                    email: "jb@domain.com",
                    password: "123"
                })
                .end((err, res) => {
                    assert.equal(2, res.redirects.length, 'From initial page to user page')
                    assert.equal(200, res.status, 'Response status should be 200!')
                })
        })

        test('Login wrongfully a user', async () => {
            chai
                .request(server)
                .post('/login')
                .send({
                    email: "jb@domain.com",
                    password: "777"
                })
                .end((err, res) => {
                    assert.equal(1, res.redirects.length, "Remain to initial page.")
                    assert.equal(200, res.status, 'Response status should be 200!')
                })
        })
    })
})