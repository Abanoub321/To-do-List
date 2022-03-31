import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import registerValidator from '../validators/registerValidator';
import loginValidator from '../validators/loginValidator';
import { string } from 'joi';

const saltRounds = 10;

const createUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { name, email, password } = req.body;
    const result = registerValidator(req.body);
    if (result.error) {
        return res.status(400).json({
            success: false,
            message: result.error.message
        })
    }
    const user = await User.findOne({ email });

    if (user)
        return res.status(409).json({
            success: false,
            message: 'User Already exists'
        })
    const hashed = await bcrypt.hash(password, saltRounds);
    try {
        const user = await new User({ name, email, password: hashed }).save();
        if (!user)
            throw new Error();
        else
            return res.status(201).json({
                success: true
            })
    } catch (error) {
        next(error);
    }
}



const loginUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { email, password } = req.body;
    try {
        let result = loginValidator(email, password);
        if (result.error) {
            return res.status(400).json({
                success: false,
                message: result.error.message
            })
        }
        const user = await User.findOne({ email });

        if (!user)
            return res.status(404).json({
                success: false,
                message: 'User does not exist'
            })
        let response = await bcrypt.compare(password, user.password);

        if (!response)
            return res.status(409).json({
                success: false,
                message: 'Password is incorrect'
            })
        else {
            const token = jwt.sign({ id: user._id }, `${process.env.JWT_SECRET}`);
            return res.status(201).json({
                success: true,
                token
            })
        }
    } catch (error) {
        next(error);
    }
}



export { createUser, loginUser };