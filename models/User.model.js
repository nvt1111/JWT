const mongoose = require('mongoose')
const Schema = mongoose.Schema();
const bcrypt = require('bcrypt')
 // Erase if already required

const {testConnection} = require("../helpers/connections_mongodb")

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    username:{
        type:String,
        lowercase:true,
        unique:true,
        required: true
    },
    password:{
        type:String,
        required:true,
    },
});
// XL dau vao phuc vu REGISTER
// xu li dl trc khi tạo DB
// theem vao USERMODEL
userSchema.pre('save', async function(next){
    try{
        console.log(`Called before save:::`, this.email, this.password);
        const salt = await bcrypt.genSalt(10);
        // băm 1 mk công 1 chút muối thì out put cua rmk này ko dự đoán đc
        // cho dù mk giống nhau thì cái nào bỏ muối nhiều nó sẽ băm băm khác nhau
        // nên rất khó mà dò
        const hashPassword = await bcrypt.hash(this.password, salt);
        this.password = hashPassword;
        next(); //sau ddos tra ve middleware

    }catch(error){
        next(error)
    }
})


//XL phucVu LOGIN
userSchema.methods.isCheckPassword = async function(password){
    try{
        return await bcrypt.compare(password, this.password)

    }catch(error){

    }
}



//Export the model
module.exports = mongoose.model('user', userSchema);