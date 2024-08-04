import { useAppStore } from '@/store'
import { useEffect, useRef, useState } from 'react'
import moment from 'moment'
import apiClient from '@/lib/api-client'
import { GET_ALL_MESSAGE_ROUTE, GET_MESSAGE_CHANNEL_ROUTE } from '@/utils/constants'
import { ScrollArea } from "@/components/ui/scroll-area"
import { HOST } from '@/utils/constants'
import { MdFolder } from 'react-icons/md'
import { IoMdDownload } from "react-icons/io";
import { IoCloseSharp } from 'react-icons/io5'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { getColor } from '@/lib/utils'

const MessageContainer = () => {
    const scrollRef = useRef()
    const {
        selectedChatType,
        selectedChatData,
        selectedChatMessages,
        setSelectedChatMessages,
        setIsDownloading,
        setFileDownloadProgress,
        userInfo
    } = useAppStore()
    const [showImage, setShowImage] = useState(false)
    const [imageUrl, setImageUrl] = useState("")
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [selectedChatMessages])

    const checkIfImage = (filePath) => {
        const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i
        return imageRegex.test(filePath)
    }
    const renderMessages = () => {
        let lastDate = null;
        return selectedChatMessages.map((message, index) => {
            const messageDate = moment(message.timestamps).format("DD/MM/YYYY")
            const showDate = messageDate !== lastDate
            lastDate = messageDate
            return (
                <div className="" key={index}>
                    {
                        showDate &&
                        <div className="text-center text-gray-500 my-2">
                            {moment(message.timestamps).format("LL")}
                        </div>
                    }
                    {
                        selectedChatType === "contact" && renderDMMessage(message)
                    }
                    {
                        selectedChatType === "channel" && renderMessageChannel(message)
                    }
                </div>
            )
        })
    }

    const handleDownloadFile = async (fileUrl) => {
        setIsDownloading(true)
        const res = await apiClient.get(
            fileUrl,
            {
                responseType: "blob",
                onDownloadProgress: (data) => {
                    setFileDownloadProgress(Math.round(100 * data.loaded / data.total))
                }
            }
        )
        const urlBlob = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a')
        link.href = urlBlob
        link.setAttribute("download", fileUrl.split('/').pop())
        document.body.appendChild(link)
        link.click()
        link.remove()
        setIsDownloading(false)
        setFileDownloadProgress(0)
        window.URL.revokeObjectURL(urlBlob)
    }

    const renderDMMessage = (message) => (
        <div className={`${message.sender === selectedChatData._id ? "text-left" : "text-right"} sm:px-10 px-5`}>
            {
                message.messageType === "text" && <div className={`${message.sender !== selectedChatData._id
                    ? "dark:bg-[#8417ff]/5 bg-[#8417ff] dark:text-[#8417ff]/90 text-white border-[#8417ff]/50"
                    : "dark:bg-[#2a2b33]/5 bg-[#2a2b33]/80 dark:text-white/80 text-white border-[#fff]/20"}
                    border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
                    {message.content}
                </div>
            }
            {
                message.messageType === 'file' && <div className={`${message.sender !== selectedChatData._id
                    ? "dark:bg-[#8417ff]/5 bg-[#8417ff]/50 dark:text-[#8417ff]/90 text-white border-[#8417ff]/50"
                    : "dark:bg-[#2a2b33]/5 bg-[#2a2b33]/50 dark:text-white/80 text-white border-[#fff]/20"}
                    border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
                    {
                        checkIfImage(message.fileUrl) ?
                            <div className='cursor-pointer'
                                onClick={() => {
                                    setShowImage(true)
                                    setImageUrl(message.fileUrl)
                                }}>
                                <img src={`${HOST + message.fileUrl}`} alt="" height={300} width={300} />
                            </div> :
                            <div className='flex items-center justify-center gap-4 cursor-pointer'>
                                <span className='text-white/80 text-3xl bg-black/20 rounded-full p-3 transition-all duration-300'>
                                    <MdFolder />
                                </span>
                                <span>{message.fileUrl.split("/").pop()}</span>
                                <span
                                    className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
                                    onClick={() => handleDownloadFile(HOST + message.fileUrl)}>
                                    <IoMdDownload />
                                </span>
                            </div>
                    }
                </div>
            }
            <div className="text-xs text-gray-600">
                {moment(message.timestamps).format("LT")}
            </div>
        </div>
    )

    const renderMessageChannel = (message) => (
        <div className={`mt-5 ${message.sender._id !== userInfo._id ? "text-left" : "text-right"}`}>
            {
                message.messageType === "text" &&
                <div className={`${message.sender._id === userInfo._id
                    ? "dark:bg-[#8417ff]/5 bg-[#8417ff] dark:text-[#8417ff]/90 text-white border-[#8417ff]/50"
                    : "dark:bg-[#2a2b33]/5 bg-[#2a2b33]/80 dark:text-white/80 text-white border-[#fff]/20"}
                    border inline-block p-4 rounded my-1 max-w-[50%] break-words ml-10`}>
                    {message.content}
                </div>
            }
            {
                message.messageType === 'file' && <div className={`${message.sender._id === userInfo._id
                    ? "dark:bg-[#8417ff]/5 bg-[#8417ff]/50 dark:text-[#8417ff]/90 text-white border-[#8417ff]/50"
                    : "dark:bg-[#2a2b33]/5 bg-[#2a2b33]/50 dark:text-white/80 text-white border-[#fff]/20"}
                    border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
                    {
                        checkIfImage(message.fileUrl) ?
                            <div className='cursor-pointer'
                                onClick={() => {
                                    setShowImage(true)
                                    setImageUrl(message.fileUrl)
                                }}>
                                <img src={`${HOST + message.fileUrl}`} alt="" height={300} width={300} />
                            </div> :
                            <div className='flex items-center justify-center gap-4 cursor-pointer'>
                                <span className='text-white/80 text-3xl bg-black/20 rounded-full p-3 transition-all duration-300'>
                                    <MdFolder />
                                </span>
                                <span>{message.fileUrl.split("/").pop()}</span>
                                <span
                                    className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
                                    onClick={() => handleDownloadFile(HOST + message.fileUrl)}>
                                    <IoMdDownload />
                                </span>
                            </div>
                    }
                </div>
            }
            {
                message.sender._id !== userInfo._id ?
                    <div className="flex items-center justify-start gap-3 mt-1 cursor-pointer w-fit">
                        <Avatar className='h-8 w-8 rounded-full overflow-hidden'>
                            {
                                message.sender.image && <AvatarImage src={HOST + message.sender.image} alt='Profile' className='object-cover w-full h-full' />
                            }
                            <AvatarFallback className={` h-8 w-8 text-lg flex items-center justify-center rounded-full ${getColor(message.sender.color)}`}>
                                {message.sender.firstName
                                    ? message.sender.firstName?.split("").shift().toUpperCase()
                                    : message.sender.email?.split("").shift().toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <span className='text-sm text-light-foreground dark:text-dark-foreground'>{`${message.sender.firstName} ${message.sender.lastName}`}</span>
                        <span className='text-xs text-gray-600'>
                            {moment(message.timestamps).format("LT")}
                        </span>
                    </div>
                    : <p className='text-xs text-gray-600 mt-1'>
                        {moment(message.timestamps).format("LT")}
                    </p>
            }
        </div>
    )

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await apiClient.post(
                    GET_ALL_MESSAGE_ROUTE,
                    { id: selectedChatData._id },
                    { withCredentials: true }
                )
                if (res.status === 200) {
                    setSelectedChatMessages(res.data)
                }
            } catch (error) {
                console.log(error);
            }
        }
        const getMessagesChannel = async () => {
            try {
                const res = await apiClient.get(
                    GET_MESSAGE_CHANNEL_ROUTE + "/" + selectedChatData._id,
                    { withCredentials: true }
                )
                if (res.status === 200) {
                    setSelectedChatMessages(res.data.messages)
                }
            } catch (error) {
                console.log(error);
            }
        }
        if (selectedChatData._id && selectedChatType === "contact") {
            getMessages()
        }
        if (selectedChatData._id && selectedChatType === "channel") {
            getMessagesChannel()
        }
    }, [selectedChatData, selectedChatType, setSelectedChatMessages])

    return (
        <div className='flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:[70vw] xl:w-[80vw] w-full'>
            <ScrollArea className='h-[690px]'>
                {renderMessages()}
                <div ref={scrollRef} />
            </ScrollArea>
            {
                showImage && <div className="fixed z-50 top-0 left-0 h-screen w-screen flex items-center justify-center backdrop-blur-lg flex-col">
                    <div className="">
                        <img src={HOST + imageUrl} alt=""
                            className='h-[80vh] w-full bg-cover' />
                    </div>
                    <div className="flex gap-5 fixed top-0 mt-5">
                        <button
                            className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
                            onClick={() => handleDownloadFile(HOST + imageUrl)}>
                            <IoMdDownload />
                        </button>
                        <button
                            className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
                            onClick={() => {
                                setShowImage(false)
                                setImageUrl("")
                            }}>
                            <IoCloseSharp />
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}

export default MessageContainer