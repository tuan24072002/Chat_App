import { useEffect } from "react";
import NewDM from "./components/new-dm";
import ProfileInfo from "./components/profile-info";
import apiClient from "@/lib/api-client";
import { GET_DM_CONTACT_ROUTE, GET_USER_CHANNEL_ROUTE } from '@/utils/constants'
import { useAppStore } from "@/store";
import ContactList from "./components/contact-list";
import CreateChannel from "./components/create-channel";
import { ModeToggle } from "../../../../components/mode-toggle";

const ContactContainer = () => {

    const { setDirectMessagesContacts, directMessagesContacts, channels, setChannels } = useAppStore()
    useEffect(() => {
        const getContact = async () => {
            const res = await apiClient.get(GET_DM_CONTACT_ROUTE, { withCredentials: true })
            if (res.status === 200) {
                setDirectMessagesContacts(res.data);
            }
        }
        const getChannel = async () => {
            const res = await apiClient.get(GET_USER_CHANNEL_ROUTE, { withCredentials: true })
            if (res.status === 200) {
                setChannels(res.data);
            }
        }

        getChannel()
        getContact()
    }, [setChannels, setDirectMessagesContacts])

    return (
        <div className='relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] w-full bg-light-background dark:bg-dark-background  border-r-2 dark:border-[#2f303b]'>
            <div className="flex p-5 items-center justify-between">
                <Logo />
                <ModeToggle />
            </div>
            <div className="my-5">
                <div className="flex items-center justify-between pr-10">
                    <Title text='Direct Messages' />
                    <NewDM />
                </div>
                <div className="max-h-[30vh] overflow-y-auto scrollbar-hidden">
                    <ContactList contacts={directMessagesContacts} />
                </div>
            </div>
            <div className="my-5">
                <div className="flex items-center justify-between pr-10">
                    <Title text='Channels' />
                    <CreateChannel />
                </div>
                <div className="max-h-[30vh] overflow-y-auto scrollbar-hidden">
                    <ContactList contacts={channels} isChannel={true} />
                </div>
            </div>
            <ProfileInfo />
        </div>
    )
}

export default ContactContainer;

const Logo = () => {
    return (
        <div className="flex justify-start items-center gap-2">
            <svg
                id="logo-38"
                width="78"
                height="32"
                viewBox="0 0 78 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {" "}
                <path
                    d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
                    className="ccustom"
                    fill="#8338ec"
                ></path>{" "}
                <path
                    d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
                    className="ccompli1"
                    fill="#975aed"
                ></path>{" "}
                <path
                    d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
                    className="ccompli2"
                    fill="#a16ee8"
                ></path>{" "}
            </svg>
            <span className="text-3xl font-semibold text-light-foreground dark:text-dark-foreground">TS</span>
        </div>
    );
};

const Title = ({ text }) => {
    return (
        <h6 className="uppercase tracking-widest text-light-title_contact dark:text-dark-title_contact pl-10 font-light text-opacity-90 text-sm">{text}</h6>
    )
}