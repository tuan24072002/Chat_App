import { Avatar } from '@/components/ui/avatar'
import { useAppStore } from '@/store/index'
import { getColor } from "@/lib/utils"
import { HOST, LOGOUT_ROUTE } from '@/utils/constants'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { IoPowerSharp } from 'react-icons/io5'
import { FiEdit2 } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../../../../../lib/api-client'

const ProfileInfo = () => {
    const { userInfo, setUserInfo } = useAppStore()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            const res = await apiClient.post(LOGOUT_ROUTE, {}, { withCredentials: true })
            if (res.status === 200) {
                setUserInfo(null)
                navigate(`/auth`)
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='absolute bottom-0 h-16 flex items-center justify-between px-5 w-full bg-light-background_info dark:bg-dark-background_info'>
            <div className="flex gap-3 items-center justify-center">
                <div className='w-12 h-12 relative'>
                    <Avatar className='h-12 w-12 rounded-full overflow-hidden'>
                        {
                            userInfo.image
                                ? <img src={HOST + userInfo.image} alt='Profile' className='object-cover w-full h-full' />
                                : <div className={`h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(userInfo.color)}`}>
                                    {
                                        userInfo.firstName
                                            ? userInfo.firstName?.split("").shift().toUpperCase()
                                            : userInfo.email?.split("").shift().toUpperCase()
                                    }
                                </div>
                        }
                    </Avatar>
                </div>
                <div className="md:text-base text-sm text-light-foreground dark:text-dark-foreground">
                    {
                        userInfo.firstName && userInfo.lastName ? userInfo.firstName + " " + userInfo.lastName : ""
                    }
                </div>
            </div>
            <div className="flex gap-5">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <FiEdit2 className='text-purple-500 text-xl font-medium'
                                onClick={() => navigate(`/profile`)} />
                        </TooltipTrigger>
                        <TooltipContent className='bg-[#1c1b1e] border-none text-white'>
                            Edit Profile
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <IoPowerSharp className='text-red-500 text-xl font-medium'
                                onClick={handleLogout} />
                        </TooltipTrigger>
                        <TooltipContent className='bg-[#1c1b1e] border-none text-white'>
                            Logout
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )
}

export default ProfileInfo