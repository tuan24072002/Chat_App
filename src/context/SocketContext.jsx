import { createContext, useContext, useEffect, useRef } from "react"
import { io } from 'socket.io-client'
import { useAppStore } from '@/store'
import { HOST } from '@/utils/constants'

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext)
}

export const SocketProvider = ({ children }) => {
    const socket = useRef()
    const { userInfo } = useAppStore()
    useEffect(() => {
        if (userInfo) {
            socket.current = io(HOST, {
                withCredentials: true,
                query: {
                    userId: userInfo._id
                }
            })
            socket.current.on("connect", () => {
                console.log(`Connected to socket server !`);
            })

            const handleReceiveMessage = (message) => {
                const { selectedChatData, selectedChatType, addMessage, addContactsInDMContacts } = useAppStore.getState()

                if (selectedChatType !== undefined &&
                    (selectedChatData._id === message.sender._id
                        || selectedChatData._id === message.receiver._id)) {

                    addMessage(message)
                    console.log(message);
                }
                addContactsInDMContacts(message)
            }

            const handleReceiveMessageChannel = (message) => {
                const { selectedChatData, selectedChatType, addMessage, addChannelInChannelList } = useAppStore.getState()
                if (selectedChatType !== undefined && selectedChatData._id === message.channelId) {
                    addMessage(message)
                    console.log(message);
                }
                addChannelInChannelList(message)
            }

            socket.current.on("receiveMessageChannel", handleReceiveMessageChannel)
            socket.current.on("receiveMessage", handleReceiveMessage)
            return () => {
                socket.current.disconnect()
            }
        }
    }, [userInfo])

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
}