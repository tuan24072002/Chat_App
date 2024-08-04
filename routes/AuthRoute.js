import { Router } from 'express'
import {
    login,
    logout,
    signup,
    getUserInfo,
    updateProfile,
    addProfileImage,
    removeProfileImage
} from '../controllers/AuthController.js'
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import multer from 'multer';

const upload = multer({ dest: "uploads/profiles/" })
const authRoute = Router();

authRoute.post(`/signup`, signup)
authRoute.post(`/login`, login)
authRoute.post(`/logout`, logout)
authRoute.get(`/user-info`, verifyToken, getUserInfo)
authRoute.put(`/update-profile`, verifyToken, updateProfile)
authRoute.put(`/add-profile-image`, verifyToken, upload.single(`profile-image`), addProfileImage)
authRoute.delete(`/remove-profile-image`, verifyToken, removeProfileImage)
export default authRoute