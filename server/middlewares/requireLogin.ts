import express from 'express';
import { any } from 'joi';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const requireLogin = async (req: express.Request | any, res: express.Response, next: express.NextFunction) => {
    const authrization = req.headers.authorization;
    let token;
    if (!authrization) {
        console.log('err');
        return next('Error');
    }
    else
        token = authrization.split(" ")[1] || "";
    
    let decoded: jwt.JwtPayload | any;
    try {
        decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
    } catch (error) {
        return res.status(409).json({
            success: false,
            message: 'Token is invalid'
        })
    }

    const user = User.findById(decoded.id);
    if (!user)
        next('ERROR');
    else {
        req.user = user;
        next();
    }


}

export default requireLogin;