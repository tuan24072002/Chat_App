import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import {
    getMessages,
    uploadFile
} from "../controllers/MessageController.js";
import multer from 'multer'

const messageRoute = Router()
const upload = multer({ dest: "uploads/files" })

messageRoute.post(`/get-messages`, verifyToken, getMessages)
messageRoute.post(`/upload-file`, verifyToken, upload.single(`file`), uploadFile)
export default messageRoute