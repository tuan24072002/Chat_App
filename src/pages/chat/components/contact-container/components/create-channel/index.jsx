import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useEffect, useState } from "react"
import { FaPlus } from 'react-icons/fa'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import apiClient from "@/lib/api-client"
import { useAppStore } from "@/store"
import {
    GET_ALL_CONTACT_ROUTE,
    CREATE_CHANNEL_ROUTE
} from "@/utils/constants"
import { Button } from '@/components/ui/button'
import MultipleSelector from "@/components/ui/multipleselect"

const CreateChannel = () => {
    const { addChannel } = useAppStore()
    const [newChannelModal, setNewChannelModal] = useState(false)
    const [allContact, setAllContact] = useState([])
    const [selectedContact, setSelectedContact] = useState([])
    const [channelName, setChannelName] = useState("")
    useEffect(() => {
        const getData = async () => {
            const res = await apiClient.get(
                GET_ALL_CONTACT_ROUTE,
                { withCredentials: true }
            )
            if (res.status === 200) {
                setAllContact(res.data)
            }
        }
        getData()
    }, [])

    const createChannel = async () => {
        try {
            if (channelName.length > 0 && selectedContact.length > 0) {
                const res = await apiClient.post(
                    CREATE_CHANNEL_ROUTE,
                    {
                        name: channelName,
                        members: selectedContact.map((contact) => contact.value)
                    },
                    {
                        withCredentials: true
                    }
                )
                if (res.status === 201) {
                    setChannelName("")
                    setSelectedContact([])
                    setNewChannelModal(false)
                    addChannel(res.data)
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus className="text-light-title_contact dark:text-dark-title_contact font-light text-opacity-90 text-start dark:hover:text-neutral-100 hover:text-[#5f5f5f] cursor-pointer transition-all duration-300"
                            onClick={() => setNewChannelModal(true)} />
                    </TooltipTrigger>
                    <TooltipContent
                        className='bg-[#1c1b1e] border-none mb-2 p-3 text-white'
                    >
                        Create New Channel
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
                <DialogContent className='bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col'>
                    <DialogHeader>
                        <DialogTitle>Please fill up the detail for new channel.</DialogTitle>
                        <DialogDescription>
                            Please fill up the detail for new channel.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="">
                        <input
                            placeholder='Channel name'
                            className='rounded-lg w-full p-2 bg-[#2c2e3b] border-none'
                            onChange={(e) => setChannelName(e.target.value)}
                            value={channelName || ""}
                        />
                    </div>
                    <div>
                        <MultipleSelector
                            className="rounded-lg bg-[#2c2e3b] border-none text-white"
                            defaultOptions={allContact}
                            placeholder="Search Contacts"
                            value={selectedContact}
                            onChange={setSelectedContact}
                            emptyIndicator={
                                <p className="text-center text-lg leading-10 text-gray-600">No result found.</p>
                            }>

                        </MultipleSelector>
                    </div>
                    <Button className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300 mt-auto"
                        onClick={createChannel}
                    >
                        Create Channel
                    </Button>
                </DialogContent>
            </Dialog>

        </>
    )
}

export default CreateChannel