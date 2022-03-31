import Joi from "joi";


const registerSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
})

const registerValidator = (params: any) => {
    const { name, email, password } = params;
    return registerSchema.validate({ name, email, password });
}

export default registerValidator;