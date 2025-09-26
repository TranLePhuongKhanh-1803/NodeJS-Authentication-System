import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
const JWT_SECRET = 'secretKey';

export const verifyToken = async(req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.redirect('/user/signin');

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.redirect('/user/signin');

        req.user = user; // Gán user vào req
        next();
    } catch (err) {
        res.redirect('/user/signin');
    }
};