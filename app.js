// app.js
import express from 'express';
import bodyParser from 'body-parser';
import ejsLayouts from 'express-ejs-layouts';
import path from 'path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { connectUsingMongoose } from './config/mongodb.js';
import userRouter from './routes/routes.js'; // dùng routes.js cho /user

dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Templates
app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.set('views', path.join(path.resolve(), 'views'));

// DB connection
connectUsingMongoose();

// Routes
app.use('/user', userRouter);

// Homepage redirect từ root
app.get('/', (req, res) => {
    res.redirect('/user/signin');
});

// Static files
app.use(express.static('public'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));