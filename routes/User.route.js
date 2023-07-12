const express = require('express')
const route = express.Router()
const User = require('../models/User.model')
const {userValidate} = require('../helpers/validation')
const createError = require('http-errors')
const {signAccessToken, verifyAccessToken, signRefreshToken} = require('../helpers/jwt_service')

route.post('/register', async (req,res,next)=>{
    try{
        const {email, password} = req.body
        const {error} = userValidate(req.body);
        console.log(`;;;;;;;; validate : `,error)
        // if(!email || !password){
        //     throw createError.BadRequest();
        // }
        if(error){
            throw createError(error.details[0].message) // thuoc loi khi console log
        }
        const isExisted = await User.findOne({
            username: email
        })
        if(isExisted){
            throw createError.Conflict(`${email} ddax ddki`)
        }
        const user = new User({
            username: email,
            password
        })
        const savedUser = await user.save()
        return res.json({
            status: 'okay',
            elements: savedUser // no se hien thi ca ham nay
        })
    }catch(error){
        next(error);
    }
})
route.post('/refresh-token', (req,res,next)=>{
    res.send('function token')
})
route.post('/login', async (req,res,next)=>{
    try{
        const {error} = userValidate(req.body);
        console.log('kkkkkkkkkkkkkkkkk', req.body)
        if(error){
            throw createError(error.details[0].message) // thuoc loi khi console log
        }
        const {email, password} = req.body
        const user = await User.findOne({username: email});
        if(!user){
            throw createError.NotFound('User not register')
        }
        const isValid = await user.isCheckPassword(password)
        if(!isValid){
            throw createError.Unauthorized()
        }
        const accessToken = await signAccessToken(user._id);
        const refreshToken = await signRefreshToken(user._id);
        res.json({ // khi di duong se dc cap access va reffresh 
            accessToken,
            refreshToken
        })
    }catch(error){
        next(error);
    }
})
route.post('/logout', (req,res,next)=>{
    res.send('function logout')
})

route.get('/getlists', verifyAccessToken,(req,res,next)=>{
    console.log(req.headers)
    const listUsers = [
        {
            email: 'abc@gmail.com'
        },
        {
            email: 'def@gmail.com'
        }
// khi verify thanh cong thi tra ve list nay
    ]
    console.log('hahahahhahahahhh')
    res.json({
        listUsers
    })
})

module.exports = route;