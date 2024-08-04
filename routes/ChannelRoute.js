import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import {
    createChannel,
    getMessageChannel,
    getUserChannels
} from "../controllers/ChannelController.js";


const channelRoute = Router()

channelRoute.post(`/create-channel`, verifyToken, createChannel)
channelRoute.get(`/get-user-channel`, verifyToken, getUserChannels)
channelRoute.get(`/get-message-channel/:channelId`, verifyToken, getMessageChannel)

export default channelRoute