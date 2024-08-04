import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessageModel.js";


export const searchContact = async (req, res) => {
    try {
        const { search } = req.body;
        if (search === undefined || search === null) {
            return res.status(400).send(`Search is required !`)
        }
        const sanitizedSearch = search.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        )

        const regex = new RegExp(sanitizedSearch, "i");
        const contacts = await User.find({
            $and: [{ _id: { $ne: req.userId } }, {
                $or: [
                    { firstName: regex },
                    { email: regex },
                    { email: regex }
                ]
            }],
        })
        return res.status(200).json(contacts)
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Internal Server Error`)
    }
}

export const getContactForDMList = async (req, res) => {
    try {
        let userId = req.userId
        userId = new mongoose.Types.ObjectId(userId)
        const contact = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: userId },
                        { receiver: userId }
                    ]
                }
            },
            {
                $sort: { timestamps: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: {
                                $eq: ["$sender", userId]
                            },
                            then: "$receiver",
                            else: "$sender"
                        }
                    },
                    lastMessageTime: { $first: "$timestamps" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo"
                }
            },
            {
                $unwind: "$contactInfo"
            },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: "$contactInfo.email",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    image: "$contactInfo.image",
                    color: "$contactInfo.color",
                }
            },
            {
                $sort: { lastMessageTime: -1 }
            }
        ])
        return res.status(200).json(contact)
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Internal Server Error`)
    }
}

export const getAllContact = async (req, res) => {
    try {
        const users = await User.find(
            { _id: { $ne: req.userId } },
            "_id firstName lastName"
        )
        const contacts = users.map((user) => ({
            label: user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.email,
            value: user._id
        }))
        return res.status(200).json(contacts)
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Internal Server Error`)
    }
}