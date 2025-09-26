// models/User.js
import mongoose from 'mongoose'; // Import mongoose để tạo schema và model

// -----------------------------
// Định nghĩa Schema cho User
// -----------------------------
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"], // Bắt buộc phải có
        trim: true, // Tự động loại bỏ khoảng trắng đầu/cuối
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true, // Không được trùng
        lowercase: true, // Chuyển email về chữ thường
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    createdAt: {
        type: Date,
        default: Date.now // Lưu thời gian tạo user
    }
}, {
    timestamps: true, // Tạo tự động createdAt và updatedAt
});

// -----------------------------
// Tạo Model dựa trên schema
// -----------------------------
const User = mongoose.model('User', userSchema);

// -----------------------------
// Export Model để dùng ở nơi khác
// -----------------------------
export default User;