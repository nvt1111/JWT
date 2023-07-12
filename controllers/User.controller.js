const User = require('../models/User.model')
const {userValidate} = require('../helpers/validation')
const createError = require('http-errors')
const {signAccessToken, verifyRefreshToken,verifyAccessToken, signRefreshToken} = require('../helpers/jwt_service')
const client = require('../helpers/connection_redis')

module.exports = {
    register: async (req,res,next)=>{
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
    },
    refreshToken: async (req,res,next)=>{
        try{
            console.log(req.body);
            const {refreshToken} = req.body;
            if(!refreshToken){
                throw createError.BadRequest();
            }
            const {userId} = await verifyRefreshToken(refreshToken);
            // tạo 2 token này
            const accessToken = await signAccessToken(userId);
            const refreshTokennew = await signRefreshToken(userId);
            res.json({
                accessToken,
                refreshTokennew
            })
            console.log('payload::::', payload)
        }catch(error){
            next(error)
        }
    },
    login: async (req,res,next)=>{
        try{
            const {error} = userValidate(req.body);
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
            console.log(isValid)
            const accessToken = await signAccessToken(user._id);
            const refreshToken = await signRefreshToken(user._id);
            
            res.json({ // khi di duong se dc cap access va reffresh 
                accessToken,
                refreshToken
            })
        }catch(error){
            next(error);
        }
    },
    logout: async(req,res,next)=>{
        try{
            // logout cungx can dung token
            const {refreshToken} = req.body;
            if(!refreshToken) throw createError.BadRequest();
            const {userId} = await verifyRefreshToken(refreshToken);
            // dong thoi xoas trong redis nua
            client.del(userId.toString(), (err,reply)=>{
                if(err) throw createError.InternalServerError();
                res.json({
                    message:'Logout '
                })
            })
        }catch(error){
            next(error)
        }
    },
    getlists: (req,res,next)=>{
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
    }
}