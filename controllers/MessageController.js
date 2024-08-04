import Message from "../models/MessageModel.js";
import { mkdirSync, renameSync } from 'fs'

export const getMessages = async (req, res) => {
    try {
        //Người nhận là mình nè
        const receiver = req.userId
        //Người gửi là người ta
        const sender = req.body.id
        if (!receiver || !sender) {
            return res.status(400).send(`Both user id are required !`)
        }

        const messages = await Message.find({
            $or: [
                { sender: receiver, receiver: sender },
                { receiver, sender }
            ]
        }).sort({ timestamps: 1 })
        return res.status(200).json(messages)
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Internal Server Error`)
    }
}

export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send(`File is required !`)
        }
        const date = Date.now()
        let fileDir = `uploads/files/${date}`
        let fileName = `${fileDir}/${req.file.originalname}`;
        mkdirSync(fileDir, { recursive: true })
        renameSync(req.file.path, fileName)
        return res.status(200).json({ filePath: fileName })
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Internal Server Error`)
    }
}