import { useAppStore } from "@/store"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { IoArrowBack } from "react-icons/io5"
import { Avatar } from '@/components/ui/avatar'
import { colors, getColor } from "@/lib/utils"
import { FaTrash, FaPlus } from 'react-icons/fa'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { ADD_PROFILE_IMAGE, HOST, REMOVE_PROFILE_IMAGE, UPDATE_PROFILE_ROUTE } from "@/utils/constants"
import { ModeToggle } from "@/components/mode-toggle"
const Profile = () => {
    const navigate = useNavigate()
    const { userInfo, setUserInfo } = useAppStore()
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [image, setImage] = useState(null)
    const [selectedColor, setSelectedColor] = useState(0)
    const [hovered, setHovered] = useState(false)
    const fileInputRef = useRef(null)

    useEffect(() => {
        if (userInfo.profileSetup) {
            setFirstName(userInfo.firstName)
            setLastName(userInfo.lastName)
            setSelectedColor(userInfo.color)
        }
        if (userInfo.image) {
            setImage(HOST + userInfo.image)
        }
    }, [userInfo])

    const validateProfile = () => {
        if (!firstName) {
            toast.dismiss()
            toast.error(`First name is required !`)
            return false
        }
        if (!lastName) {
            toast.dismiss()
            toast.error(`Last name is required !`)
            return false
        }
        return true
    }
    const handleSave = async () => {
        if (validateProfile()) {
            try {
                const res = await apiClient.put(
                    UPDATE_PROFILE_ROUTE,
                    { firstName, lastName, color: selectedColor },
                    { withCredentials: true }
                )
                if (res.status === 200 && res.data.user) {
                    setUserInfo({ ...res.data.user })
                    toast.dismiss()
                    toast.success(`Profile updated successfully !`)
                    navigate(`/chat`)
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleBack = () => {
        if (userInfo.profileSetup) {
            navigate(`/chat`)
        } else {
            toast.dismiss()
            toast.error(`Please setup profile to continue !`)
        }
    }

    const handleFileInput = () => {
        fileInputRef.current.click();
    }

    const handleImageChange = async (e) => {
        const file = e.target.files[0]
        if (file.type.slice(0, 5) !== 'image') {
            toast.dismiss()
            return toast.error(`Please select image file !`)
        }
        const formData = new FormData()
        formData.append("profile-image", file)

        const res = await apiClient.put(ADD_PROFILE_IMAGE, formData, { withCredentials: true })
        if (res.status === 200 && res.data.user.image) {
            setUserInfo({ ...userInfo, image: res.data.user.image })
            toast.dismiss()
            toast.success(`Image updated successfully !`)
        }
    }
    const handleDeleteImage = async () => {
        try {
            const res = await apiClient.delete(REMOVE_PROFILE_IMAGE, { withCredentials: true })
            if (res.status === 200) {
                setUserInfo({ ...userInfo, image: null })
                setImage(null)
                toast.dismiss()
                toast.success(`Profile image remove successfully !`)
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='dark:bg-dark-background bg-light-background relative h-screen flex items-center flex-col gap-10'>
            <div className={`flex flex-col justify-center gap-10 w-[80vw] p-4 rounded-md my-auto md:w-max outline ${selectedColor === 0
                ? 'outline-[#ff006faa] bg-[#712c4a57]/10'
                : selectedColor === 1
                    ? 'outline-[#ffd60abb] bg-[#ffd60a2a]/10'
                    : selectedColor === 2
                        ? 'outline-[#06d6a0bb] bg-[#06d6a02a]/10' :
                        'outline-[#4cc9f0bb] bg-[#4cc9f02a]/10'} outline-1`}>
                <div className="flex items-center justify-center relative">
                    <IoArrowBack className="text-4xl absolute left-0 lg:text-6xl text-light-foreground dark:text-dark-foreground cursor-pointer" onClick={handleBack} />
                    <h1 className="text-4xl lg:text-6xl text-center text-light-foreground dark:text-dark-foreground">Profile</h1>
                </div>
                <div className="grid sm:grid-cols-2 sm:gap-0 gap-16 grid-cols-1">
                    <div className="h-full w-full md:w-48 md:h-48 relative flex items-center justify-center rounded-full"
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        onClick={() => setHovered(true)}>
                        <Avatar className='h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden'>
                            {
                                image
                                    ? <img src={image} alt='Profile' className='object-cover w-full h-full' />
                                    : <div className={`h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectedColor)}`}>
                                        {
                                            firstName
                                                ? firstName?.split("").shift().toUpperCase()
                                                : userInfo.email?.split("").shift().toUpperCase()
                                        }
                                    </div>
                            }
                        </Avatar>
                        {
                            hovered &&
                            <div className="absolute h-32 w-32 md:w-48 md:h-48 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full cursor-pointer" onClick={image ? handleDeleteImage : handleFileInput}>
                                {
                                    image
                                        ? <FaTrash className="text-white md:text-5xl text-3xl" />
                                        : <FaPlus className="text-white md:text-5xl text-3xl" />
                                }
                            </div>
                        }
                        <input
                            type="file"
                            ref={fileInputRef}
                            hidden
                            onChange={(e) => handleImageChange(e)}
                            name="profile-image"
                            accept=".png, .jpg, .jpeg, .svg, .webp" />
                    </div>
                    <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
                        <div className="w-full">
                            <Input placeholder="Email" type="email" disabled value={userInfo.email || ''} className='rounded-lg p-6 bg-[#2c2e3b] border-none' />
                        </div>
                        <div className="w-full">
                            <Input placeholder="First Name" type="text" value={firstName || ''} className='rounded-lg p-6 bg-[#2c2e3b] border-none outline-none' onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        <div className="w-full">
                            <Input placeholder="Last Name" type="text" value={lastName || ''} className='rounded-lg p-6 bg-[#2c2e3b] border-none outline-none' onChange={(e) => setLastName(e.target.value)} />
                        </div>
                        <div className="w-full flex gap-5">
                            {
                                colors.map((color, index) => {
                                    return (
                                        <div className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-100 ${selectedColor === index ? 'outline outline-white/50 outline-1' : ""}`} key={index} onClick={() => setSelectedColor(index)}></div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="w-full">
                    <Button className='h15 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300' onClick={handleSave}>Save</Button>
                </div>
            </div>
            <div className="absolute top-4 right-4">
                <ModeToggle />
            </div>
        </div>
    )
}

export default Profile