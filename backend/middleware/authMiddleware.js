import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect =  asyncHandler(async (req, res, next) =>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            
            req.user = await User.findById(decoded.id).select('-password')

            console.log(req.user)
            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not Authorised, token failed')
        }
    }

    if(!token) {
        res.status(404);
        throw new Error('Not Authorised, token failed')
    }
})


const isAdmin = (req, res, next)=>{
    if(req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(404);
        throw new Error('Not Authorised as an admin')
    }
}

export { protect, isAdmin }