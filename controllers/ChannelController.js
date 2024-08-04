import User from "../models/UserModel.js";
import Channel from "../models/ChannelModel.js";
import mongoose from "mongoose";

export const createChannel = async (req, res) => {
    try {
        const { name, members } = req.body
        const userId = req.userId

        const admin = await User.findById(userId)
        if (!admin) {
            return res.status(400).send(`Admin user not found !`)
        }
        const validateMembers = await User.find({ _id: { $in: members } })
        if (validateMembers.length !== members.length) {
            return res.status(400).send(`Some members are not valid users !`)
        }
        const newChannel = new Channel({
            name,
            members,
            admin: userId
        })
        await newChannel.save()
        return res.status(201).send(newChannel)
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Internal Server Error`)
    }
}

export const getUserChannels = async (req, res) => {
    try {
        // const userId = new mongoose.Types.ObjectId(req.userId)
        const userId = req.userId

        const channels = await Channel.find({
            $or: [{ admin: userId }, { members: userId }]
        }).sort({ updatedAt: -1 })

        return res.status(200).send(channels)
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Internal Server Error`)
    }
}

export const getMessageChannel = async (req, res) => {
    try {
        const { channelId } = req.params
        const channel = await Channel.findById(channelId)
            .populate({ path: "messages", populate: "sender" })
        if (!channel) {
            return res.status(404).send(`Channel not found !`)
        }
        return res.status(200).send(channel)
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Internal Server Error`)
    }
}