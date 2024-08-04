import { useAppStore } from "@/store"
import { Avatar } from '@/components/ui/avatar'
import { HOST } from '@/utils/constants'
import { getColor } from '@/lib/utils'

const ContactList = ({ contacts, isChannel = false }) => {
    const {
        selectedChatData,
        setSelectedChatData,
        setSelectedChatType,
        // selectedChatType,
        setSelectedChatMessages
    } = useAppStore()

    const handleClick = (contact) => {
        if (isChannel) setSelectedChatType("channel")
        else setSelectedChatType("contact")
        setSelectedChatData(contact)
        if (selectedChatData && selectedChatData._id !== contact._id) {
            setSelectedChatMessages([])
        }
    }
    return (
        <div className='mt-5'>
            {
                contacts.map(contact => {
                    return (
                        <div className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${selectedChatData && selectedChatData._id === contact._id ? "bg-[#8417ff]" : "hover:bg-light-hover_contact_list dark:hover:bg-dark-hover_contact_list"}`}
                            key={contact._id}
                            onClick={() => handleClick(contact)}>
                            <div className="flex gap-5 items-center justify-start text-light-contact_list dark:text-dark-contact_list">
                                {
                                    !isChannel &&
                                    <Avatar className='h-10 w-10 rounded-full overflow-hidden'>
                                        {
                                            contact.image
                                                ? <img src={HOST + contact.image} alt='Profile' className='object-cover w-full h-full' />
                                                : <div className={`${selectedChatData && selectedChatData._id === contact._id ? "bg-[#ffffff22] border-2 border-white/70" : getColor(contact.color)} h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full`}>
                                                    {
                                                        contact.firstName
                                                            ? contact.firstName?.split("").shift().toUpperCase()
                                                            : contact.email?.split("").shift().toUpperCase()
                                                    }
                                                </div>
                                        }
                                    </Avatar>
                                }
                                {
                                    isChannel && <div className="dark:bg-[#ffffff22] bg-[#C2C2C2] h-10 w-10 flex items-center justify-center rounded-full">#</div>
                                }
                                {
                                    isChannel ? <span>{contact.name}</span> :
                                        <span className="">
                                            {
                                                contact.firstName && contact.lastName ? contact.firstName + " " + contact.lastName : contact.email
                                            }
                                        </span>
                                }
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default ContactList