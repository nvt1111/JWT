const express = require('express')
const route = express.Router()
const UserController = require('../controllers/User.controller')
const {verifyAccessToken} = require('../helpers/jwt_service')


route.post('/register', UserController.register)
route.post('/refresh-token',UserController.refreshToken )
route.post('/login',UserController.login )
route.delete('/logout',UserController.logout )

route.get('/getlists', verifyAccessToken,UserController.getlists)

module.exports = route;