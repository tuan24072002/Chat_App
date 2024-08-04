import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { compare } from "bcrypt";
import { renameSync, unlinkSync } from 'fs'
const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge })
}

export const signup = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(404).send(`Email or Password is required !`)
        }
        const user = await User.create({ email, password })

        res.cookie('jwt', createToken(email, user._id), {
            maxAge,
            secure: true,
            sameSite: "None"
        })

        return res.status(201).json({
            user: {
                _id: user._id,
                email: user.email,
                profileSetup: user.profileSetup
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Internal Server Error`)
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(404).send(`Email or Password is required !`)
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).send(`Email not found !`)
        }
        const auth = await compare(password, user.password)
        if (!auth) {
            return res.status(404).send(`Password is incorrect !`)
        }

        res.cookie('jwt', createToken(email, user._id), {
            maxAge,
            secure: true,
            sameSite: "None"
        })

        return res.status(201).json({
            user: {
                _id: user._id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Internal Server Error`)
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie('jwt', "", {
            maxAge: 1,
            secure: true,
            sameSite: "None"
        })
        return res.status(200).send(`Logout successful !`)
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Internal Server Error`)
    }
}

export const getUserInfo = async (req, res) => {
    try {
        const userData = await User.findById(req.userId)
        if (!userData) {
            return res.status(404).send(`UserID not found !`)
        }
        return res.status(200).json({
            user: {
                _id: userData._id,
                email: userData.email,
                profileSetup: userData.profileSetup,
                firstName: userData.firstName,
                lastName: userData.lastName,
                image: userData.image,
                color: userData.color
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Internal Server Error`)
    }
}

export const updateProfile = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            image,
            color
        } = req.body

        if (!firstName || !lastName) {
            return res.status(400).send(`First name or last name is required !`)
        }

        const userData = await User.findByIdAndUpdate({ _id: req.userId }, {
            firstName,
            lastName,
            image,
            color,
            profileSetup: true
        }, { new: true, runValidators: true })
        if (!userData) {
            return res.status(404).send(`UserID not found !`)
        }
        return res.status(200).json({
            user: {
                _id: userData._id,
                email: userData.email,
                profileSetup: userData.profileSetup,
                firstName: userData.firstName,
                lastName: userData.lastName,
                image: userData.image,
                color: userData.color
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Internal Server Error`)
    }
}

export const addProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send(`File is required !`)
        }
        const date = Date.now()
        let fileName = "uploads/profiles/" + date + "_" + req.file.originalname;
        renameSync(req.file.path, fileName)
        const updatedUser = await User.findByIdAndUpdate(
            { _id: req.userId },
            { image: fileName },
            {
                new: true,
                runValidators: true
            }
        )
        return res.status(200).json({
            user: {
                _id: updatedUser._id,
                email: updatedUser.email,
                profileSetup: updatedUser.profileSetup,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                image: updatedUser.image,
                color: updatedUser.color
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Internal Server Error`)
    }
}

export const removeProfileImage = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (!user) {
            return res.status(404).send(`User not found !`)
        }
        if (user.image) {
            unlinkSync(user.image)
        }
        await User.updateOne({ _id: req.userId }, { image: null })
        return res.status(200).send('Profile image remove successfully !')
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Internal Server Error`)
    }
}