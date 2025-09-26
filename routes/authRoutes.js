// routes/authRoutes.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const authRouter = express.Router();

// Secret key JWT
const JWT_SECRET = 'secretKey'; // bạn có thể dùng process.env.JWT_SECRET

// ------------------- REGISTER -------------------
authRouter.post('/register', async(req, res) => {
    try {
        const { username, email, password, cpassword } = req.body;

        // Kiểm tra confirm password
        if (password !== cpassword) {
            return res.render('signup', { message: 'Passwords do not match' });
        }

        // Kiểm tra email đã tồn tại
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.render('signup', { message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // Redirect sang trang login
        res.redirect('/user/signin');
    } catch (err) {
        res.render('signup', { message: err.message });
    }
});

// ------------------- LOGIN -------------------
authRouter.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.render('signin', { message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.render('signin', { message: 'Invalid credentials' });

        // Tạo JWT
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        // Lưu token vào cookie
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

        // Redirect sang homepage
        res.redirect('/user/homepage');
    } catch (err) {
        res.render('signin', { message: err.message });
    }
});

// ------------------- LOGOUT -------------------
authRouter.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/user/signin');
});

export default authRouter;