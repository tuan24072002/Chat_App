import { Server } from 'socket.io'
import Message from './models/MessageModel.js';
import Channel from './models/ChannelModel.js';

const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            methods: ["GET", "POST"],
            credentials: true
        }
    })

    const userSocketMap = new Map();
    const disconnect = (socket) => {
        console.log(`Client disconnected: ${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId)
                break;
            }
        }
    }
    const sendMessage = async (message) => {
        const senderSocketId = userSocketMap.get(message.sender);
        const receiverSocketId = userSocketMap.get(message.receiver);

        const createdMessage = await Message.create(message)

        const messageData = await Message.findById(createdMessage._id)
            .populate("sender")
            .populate("receiver")
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receiveMessage", messageData);
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("receiveMessage", messageData);
        }
    }
    const sendMessageChannel = async (message) => {
        const {
            sender,
            content,
            messageType,
            fileUrl,
            channelId
        } = message
        const createdMessage = await Message.create({
            sender,
            messageType,
            content,
            fileUrl,
            receiver: null,
        })
        const messageData = await Message.findById(createdMessage._id)
            .populate("sender")
            .exec()
        await Channel.findByIdAndUpdate(
            { _id: channelId },
            { $push: { messages: createdMessage._id } }
        )

        const channel = await Channel.findById(channelId).populate("members")

        const finalData = { ...messageData._doc, channelId: channel._id }

        if (channel && channel.members) {
            channel.members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member._id.toString())
                if (memberSocketId) {
                    io.to(memberSocketId).emit("receiveMessageChannel", finalData)
                }
            })
            const adminSocketId = userSocketMap.get(channel.admin.toString())
            if (adminSocketId) {
                io.to(adminSocketId).emit("receiveMessageChannel", finalData)
            }
        }
    }

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId
        if (userId) {
            userSocketMap.set(userId, socket.id)
            console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
        } else {
            console.log("User ID not provided during connection !");
        }
        socket.on("sendMessage", sendMessage)
        socket.on("sendMessageChannel", sendMessageChannel)
        socket.on("disconnect", () => disconnect(socket))
    })
}
export default setupSocket