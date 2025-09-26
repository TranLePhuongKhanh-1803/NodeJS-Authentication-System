// routes/routes.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// ------------------- GET Routes -------------------

// Render Sign Up page
router.get('/signup', (req, res) => {
    res.render('signup', { message: null });
});

// Render Sign In page
router.get('/signin', (req, res) => {
    res.render('signin', { message: null });
});

// Render Homepage (protected)
router.get('/homepage', verifyToken, async(req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.redirect('/user/signin');
        res.render('homepage', { username: user.username, email: user.email });
    } catch (err) {
        res.redirect('/user/signin');
    }
});

// Logout user
router.get('/signout', (req, res) => {
    res.clearCookie('token'); // xóa cookie JWT
    res.redirect('/user/signin');
});

// Render Forgot Password page
router.get('/forgot-password', (req, res) => {
    res.render('forgot-password', { message: null });
});

// Render Change Password page
router.get('/change-password', (req, res) => {
    res.render('change-password', { message: null });
});

// ------------------- POST Routes -------------------

// POST /signup
router.post('/signup', async(req, res) => {
    try {
        const { username, email, password } = req.body;
        const existUser = await User.findOne({ email });
        if (existUser) return res.render('signup', { message: 'Email already registered' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // Chuyển sang trang signin sau khi đăng ký thành công
        res.redirect('/user/signin');
    } catch (err) {
        res.render('signup', { message: err.message });
    }
});

// POST /signin
router.post('/signin', async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.render('signin', { message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.render('signin', { message: 'Invalid credentials' });

        // Tạo JWT token 1h
        const token = jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1h' });

        // Lưu token vào cookie
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/user/homepage');
    } catch (err) {
        res.render('signin', { message: err.message });
    }
});

// POST /forgot-password
router.post('/forgot-password', async(req, res) => {
    // TODO: logic quên mật khẩu
    res.render('forgot-password', { message: 'Function not implemented yet' });
});

// POST /change-password
router.post('/change-password', async(req, res) => {
    // TODO: logic đổi mật khẩu
    res.render('change-password', { message: 'Function not implemented yet' });
});

export default router;