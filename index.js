import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import authRoute from './routes/AuthRoute.js'
import contactRoute from './routes/ContactRoute.js'
import messageRoute from './routes/MessageRoute.js'
import channelRoute from './routes/ChannelRoute.js'
import setupSocket from './socket.js'


dotenv.config()
const port = process.env.PORT || 7777
const app = express()
const mongoURL = process.env.MONGODB_URL
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}))
//public static local folder
app.use("/uploads/profiles", express.static(`uploads/profiles`))
app.use("/uploads/files", express.static(`uploads/files`))

app.use(express.json())
app.use(cookieParser())

//Route
app.use('/api/auth', authRoute)
app.use('/api/contact', contactRoute)
app.use(`/api/message`, messageRoute)
app.use(`/api/channel`, channelRoute)

//Listening to port
const server = app.listen(port, () => {
    console.log(`Backend listening at
http://localhost:${port}/ 🚀`);
})
setupSocket(server)
mongoose.connect(mongoURL)
    .then(() => console.log(`MongoDB is connected ! ✨`))
    .catch((err) => console.log(err.message))