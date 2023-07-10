const Joi = require('joi')

const userValidate = data =>{ //data la truyen vao de check
    const userSchema = Joi.object({
        email: Joi.string().pattern(new RegExp('gmail.com$')).email().lowercase().required(),
        password: Joi.string().min(2).max(32).required()
    })
    return userSchema.validate(data) //data la nhung thu can kiem tra
}
module.exports = {
    userValidate
}