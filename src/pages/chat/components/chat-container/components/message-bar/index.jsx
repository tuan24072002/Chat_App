import { useEffect, useRef, useState } from "react"
import { GrAttachment } from 'react-icons/gr'
import { MdEmojiEmotions } from "react-icons/md"
import { IoSend } from 'react-icons/io5'
import EmojiPicker from 'emoji-picker-react';
import { useAppStore } from "@/store";
import { useSocket } from "@/context/SocketContext";
import apiClient from "../../../../../../lib/api-client";
import { UPLOAD_FILE_ROUTE } from '@/utils/constants'

const MessageBar = () => {
    const {
        selectedChatType,
        selectedChatData,
        userInfo,
        setIsUploading,
        setFileUploadProgress,
    } = useAppStore()
    const socket = useSocket()
    const emojiRef = useRef(null)
    const fileInputRef = useRef(null)
    const [message, setMessage] = useState("")
    const [emojiPicker, setEmojiPicker] = useState(false)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (emojiRef.current && !emojiRef.current.contains(e.target)) {
                setEmojiPicker(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [emojiRef])

    const handleAddEmoji = (emoji) => {
        setMessage((msg) => msg + emoji.emoji)
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (message === "") return;
        if (selectedChatType === "contact") {
            await socket.emit("sendMessage", {
                sender: userInfo._id,
                receiver: selectedChatData._id,
                content: message,
                messageType: "text",
                fileUrl: undefined
            })

        } else if (selectedChatType === "channel") {
            await socket.emit("sendMessageChannel", {
                sender: userInfo._id,
                content: message,
                messageType: "text",
                fileUrl: undefined,
                channelId: selectedChatData._id
            })
        }
        setMessage("")
    }

    const handleAttachmentClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }
    const handleFileChange = async (e) => {
        try {
            const file = e.target.files[0]
            if (file) {
                const formData = new FormData()
                formData.append("file", file)
                setIsUploading(true)
                const res = await apiClient.post(
                    UPLOAD_FILE_ROUTE,
                    formData,
                    {
                        withCredentials: true,
                        onUploadProgress: (data) => {
                            setFileUploadProgress(Math.round(100 * data.loaded / data.total))
                        }
                    }
                )
                if (res.status === 200 && res.data) {
                    setIsUploading(false)
                    if (selectedChatType === "contact") {
                        await socket.emit("sendMessage", {
                            sender: userInfo._id,
                            receiver: selectedChatData._id,
                            content: undefined,
                            messageType: "file",
                            fileUrl: res.data.filePath,
                        })
                    } else if (selectedChatType === "channel") {
                        await socket.emit("sendMessageChannel", {
                            sender: userInfo._id,
                            content: undefined,
                            messageType: "file",
                            fileUrl: res.data.filePath,
                            channelId: selectedChatData._id
                        })
                    }
                }
            }
        } catch (error) {
            setIsUploading(false)
            console.log(error);
        }
    }
    return (
        <form onSubmit={handleSendMessage} className='h-[10vh] border-2 bg-light-background dark:bg-dark-background flex justify-center items-center px-10 gap-6'>
            <div className="flex-1 flex dark:bg-[#2a2b33] bg-[#363636] rounded-md items-center gap-5 sm:pr-5">
                <input
                    type="text"
                    value={message || ''}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 sm:p-5 p-3 bg-transparent rounded-md focus:border-none focus:outline-none"
                    placeholder="Enter message ..." />
                <div className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all cursor-pointer'
                    onClick={handleAttachmentClick}>
                    <GrAttachment className="text-2xl" />
                </div>
                <div className="relative">
                    <div className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all cursor-pointer'
                        onClick={() => setEmojiPicker(true)}>
                        <MdEmojiEmotions className="text-2xl" />
                    </div>
                    <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} />
                    <div ref={emojiRef} className="absolute bottom-16 sm:right-0 -right-[70px] bg-red-200">
                        <EmojiPicker
                            theme="dark"
                            open={emojiPicker}
                            onEmojiClick={handleAddEmoji}
                            autoFocusSearch={false} />
                    </div>
                </div>
                <button className='sm:hidden flex bg-[#8417ff] hover:bg-[#741bda] focus:bg-[#741bda] p-3 rounded-md items-center justify-center focus:border-none focus:outline-none focus:text-white duration-300 transition-all'>
                    <IoSend className="text-2xl" />
                </button>
            </div>
            <button className='sm:flex hidden bg-[#8417ff] hover:bg-[#741bda] focus:bg-[#741bda] rounded-md items-center justify-center p-5 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'>
                <IoSend className="text-2xl" />
            </button>
        </form>
    )
}

export default MessageBar