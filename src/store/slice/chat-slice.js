
export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    directMessagesContacts: [],
    isUploading: false,
    isDownloading: false,
    fileUploadProgress: 0,
    fileDownloadProgress: 0,
    channels: [],
    setChannels: (channels) => set({ channels }),
    setIsUploading: (isUploading) => set({ isUploading }),
    setIsDownloading: (isDownloading) => set({ isDownloading }),
    setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
    setFileDownloadProgress: (fileDownloadProgress) => set({ fileDownloadProgress }),
    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
    setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),
    setDirectMessagesContacts: (directMessagesContacts) => set({ directMessagesContacts }),
    closeChat: () => set({
        selectedChatType: undefined,
        selectedChatData: undefined,
        selectedChatMessages: []
    }),
    addMessage: (message) => {
        const selectedChatMessages = get().selectedChatMessages
        const selectedChatType = get().selectedChatType
        set({
            selectedChatMessages: [
                ...selectedChatMessages, {
                    ...message,
                    receiver:
                        selectedChatType === "channel"
                            ? message.receiver
                            : message.receiver._id,
                    sender:
                        selectedChatType === "channel"
                            ? message.sender
                            : message.sender._id,
                }
            ]
        })
    },
    addChannel: (channel) => {
        const channels = get().channels
        set({ channels: [channel, ...channels] })
    },
    addChannelInChannelList: (message) => {
        const channels = get().channels
        const data = channels.find(channel => channel._id === message.channelId)
        const index = channels.findIndex(channel => channel._id === message.channelId)
        if (index !== -1 && index !== undefined) {
            channels.splice(index, 1)
            channels.unshift(data)
        }
    },
    addContactsInDMContacts: (message) => {
        const userId = get().userInfo._id
        const fromId = message.sender._id === userId
            ? message.receiver._id
            : message.sender._id
        const fromData = message.sender._id === userId
            ? message.receiver
            : message.sender
        const dmContacts = get().directMessagesContacts;
        const data = dmContacts.find(contact => contact._id === fromId)
        const index = dmContacts.findIndex(contact => contact._id === fromId)

        // console.log('userId:', userId);
        // console.log('formID:', fromId);
        // console.log('formData:', fromData);
        // console.log('dmContacts:', dmContacts);
        // console.log('data:', data);
        // console.log('index:', index);


        if (index !== -1 && index !== undefined) {
            dmContacts.splice(index, 1)
            dmContacts.unshift(data)
        } else {
            dmContacts.unshift(fromData)
        }
        set({ directMessagesContacts: dmContacts })
    }
})