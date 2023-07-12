const JWT = require('jsonwebtoken')
const createError = require('http-errors')
// hafm tao access Token
const signAccessToken = async (userId) =>{
    return new Promise((resolve, reject)=>{
        const payload ={
            userId
        }
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const options = {
            expiresIn: '1m'
        }
        JWT.sign(payload, secret, options, (err, token)=>{
            if(err) reject(err)
            resolve(token)
        })
    })
}

/////// Verify accesstoken

const verifyAccessToken = (req, res, next) =>{
    if(!req.headers['authorization']){
        return next(createError.Unauthorized())
    }
    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];
    // nos thuoc authorization cua req.header
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,payload)=>{
        if(err){
            return next(createError.Unauthorized()) // co function ()
        }
        req.payload = payload;
        console.log(`day neeeeeeeeeeeeeeeeee ${payload}`)
        next();
    })
}

// lấy accessToken sau khi hết hạn bằng refreshtoken
const signRefreshToken = async (userId) =>{
    return new Promise((resolve, reject)=>{
        const payload ={
            userId
        }
        const secret = process.env.REFRESH_TOKEN_SECRET;
        const options = {
            expiresIn: '1y'
        }
        JWT.sign(payload, secret, options, (err, token)=>{
            if(err) reject(err)
            resolve(token)
        })
    })
}
module.exports = {
    signAccessToken,
    verifyAccessToken,
    signRefreshToken
}