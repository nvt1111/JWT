const express = require('express')
const app = express()
require('dotenv').config()
const createError = require('http-errors')
const UserRoute = require('./routes/User.route')
require('./helpers/connections_mongodb')

app.get('/', (req,res, next)=>{
    console.log('a::',a)
    res.send('Home page')
})

//Content-Type: application/json
// De su content tren
app.use(express.json()) // Cấu hình ứng dụng để chấp nhận dữ liệu JSON
app.use(express.urlencoded({extended: true})) // Cấu hình ứng dụng để chấp nhận dữ liệu URL mã hóa
// import route
app.use('/user', UserRoute)


// middleware
// app.use su dung de dang ki mot middleware
app.use((req,res,next)=>{
    // const error = new Error('Not found') // message loi
    // error.status = 500
    // next(error); // next chuyen Ob den middleware tiep theo
    // tajo loi chuyen nghiep hon
    next(createError.NotFound('This route does not exxist'))
})

app.use((err, req, res, next) =>{
    res.json({
        status: err.status || 500,
        message: err.message
    })
})


const PORT = process.env.PORT || 3001

app.listen(PORT, () =>{
    console.log(`Server start on Port : ${PORT}`)
} )