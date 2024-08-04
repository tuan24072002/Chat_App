import { RiCloseFill } from 'react-icons/ri'
import { useAppStore } from '@/store'
import { Avatar } from '@/components/ui/avatar'
import { getColor } from "@/lib/utils"
import { HOST } from "@/utils/constants"

const ChatHeader = () => {
    const { closeChat, selectedChatData, selectedChatType } = useAppStore()
    return (
        <div className='h-[10vh] border-b-2 dark:border-[#2f303b] text-light-foreground dark:text-dark-foreground flex items-center justify-between md:px-10 px-5'>
            <div className="flex items-center justify-between gap-5 w-full">
                <div className="flex gap-3 items-center justify-center">
                    <div className='w-12 h-12 relative'>
                        {
                            selectedChatType === "contact" ?
                                <Avatar className='h-12 w-12 rounded-full overflow-hidden'>
                                    {
                                        selectedChatData.image
                                            ? <img src={HOST + selectedChatData.image} alt='Profile' className='object-cover w-full h-full' />
                                            : <div className={`h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(selectedChatData.color)}`}>
                                                {
                                                    selectedChatData.firstName
                                                        ? selectedChatData.firstName?.split("").shift().toUpperCase()
                                                        : selectedChatData.email?.split("").shift().toUpperCase()
                                                }
                                            </div>
                                    }
                                </Avatar> :
                                <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">#</div>
                        }

                    </div>
                    {
                        selectedChatType === "channel" &&
                        <div>{selectedChatData.name}</div>
                    }
                    {
                        selectedChatType === 'contact' &&
                        <div className="">
                            {
                                selectedChatData.firstName && selectedChatData.lastName ? selectedChatData.firstName + " " + selectedChatData.lastName : selectedChatData.email
                            }
                        </div>
                    }
                </div>
                <div className="flex gap-5 items-center justify-center">
                    <button className='text-neutral-500 focus:border-none focus:outline-none dark:focus:text-white focus:text-gray-500 duration-300 transition-all'
                        onClick={() => closeChat()}>
                        <RiCloseFill className='text-3xl' />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatHeader