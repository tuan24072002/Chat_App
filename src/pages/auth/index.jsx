import Background from '@/assets/login2.png'
import Victory from '@/assets/victory.svg'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from 'react'
import { toast } from "sonner"
import apiClient from '@/lib/api-client'
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '@/utils/constants'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store'
import { ModeToggle } from '@/components/mode-toggle'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
const Auth = () => {
    const navigate = useNavigate()
    const { setUserInfo } = useAppStore()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPasswordLogin, setShowPasswordLogin] = useState(false)
    const [showPasswordRegister, setShowPasswordRegister] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const validateSignup = () => {
        if (email === '') {
            toast.dismiss()
            toast.error(`Email is required !`)
            return false
        }
        if (password === '') {
            toast.dismiss()
            toast.error(`Password is required !`)
            return false
        }
        if (confirmPassword === '') {
            toast.dismiss()
            toast.error(`Confirm password is required !`)
            return false
        }
        if (password !== confirmPassword) {
            toast.dismiss()
            toast.error(`Confirm password does not match !`)
            return false
        }
        return true
    }
    const validateLogin = () => {
        if (email === '') {
            toast.dismiss()
            toast.error(`Email is required !`)
            return false
        }
        if (password === '') {
            toast.dismiss()
            toast.error(`Password is required !`)
            return false
        }
        return true
    }
    const handleLogin = async (e) => {
        e.preventDefault()
        if (validateLogin()) {
            const res = await apiClient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true })
            if (res.status === 201) {
                setUserInfo(res.data.user)
                if (res.data.user.profileSetup) {
                    navigate(`/chat`)
                } else {
                    navigate(`/profile`)
                }
            }
        }
    }
    const handleSignup = async (e) => {
        e.preventDefault()
        if (validateSignup()) {
            const res = await apiClient.post(SIGNUP_ROUTE, { email, password }, { withCredentials: true })
            if (res.status === 201) {
                setUserInfo(res.data.user)
                navigate(`/profile`)
            }
        }
    }
    return (
        <div className='h-[100vh] w-[100vw] flex items-center justify-center relative'>
            <div className="h-[80vh] bg-black/5 border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
                <div className="flex flex-col gap-10 items-center
                    justify-center">
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center justify-center">
                            <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
                            <img src={Victory} alt="Victory Emoji" className={`h-[100px]`} />
                        </div>
                        <p className='font-medium text-center'>
                            Fill in the details to get started with the best chat app !
                        </p>
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <Tabs defaultValue="login" className='w-3/4'>
                            <TabsList className='bg-transparent rounded-none w-full'>
                                <TabsTrigger className='data-[state=active]:bg-transparent text-light-foreground dark:text-dark-foreground text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300' value="login">Login</TabsTrigger>
                                <TabsTrigger className='data-[state=active]:bg-transparent text-light-foreground dark:text-dark-foreground text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300' value="signup">Sign Up</TabsTrigger>
                            </TabsList>
                            <TabsContent value="login">
                                <form onSubmit={handleLogin} className='flex flex-col gap-5 mt-10'>
                                    <Input placeholder='Email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} className='rounded-full p-6' />
                                    <div className='relative'>
                                        <Input placeholder='Password' type={showPasswordLogin ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className='rounded-full p-6' />
                                        <div className='absolute right-4 top-[50%] -translate-y-1/2 cursor-pointer text-xl' onClick={() => setShowPasswordLogin(prev => !prev)}>
                                            {
                                                !showPasswordLogin ? <FaRegEye /> : <FaRegEyeSlash />
                                            }
                                        </div>
                                    </div>
                                    <Button className='rounded-full p-6'>Login</Button>
                                </form>
                            </TabsContent>
                            <TabsContent value="signup" >
                                <form className='flex flex-col gap-5 mt-10' onSubmit={handleSignup}>
                                    <Input placeholder='Email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} className='rounded-full p-6' />
                                    <div className='relative'>
                                        <Input placeholder='Password' type={showPasswordRegister ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className='rounded-full p-6' />
                                        <div className='absolute right-4 top-[50%] -translate-y-1/2 cursor-pointer text-xl' onClick={() => setShowPasswordRegister(prev => !prev)}>
                                            {
                                                !showPasswordRegister ? <FaRegEye /> : <FaRegEyeSlash />
                                            }
                                        </div>
                                    </div>
                                    <div className='relative'>
                                        <Input placeholder='Confirm Password' type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className='rounded-full p-6' />
                                        <div className='absolute right-4 top-[50%] -translate-y-1/2 cursor-pointer text-xl' onClick={() => setShowConfirmPassword(prev => !prev)}>
                                            {
                                                !showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />
                                            }
                                        </div>
                                    </div>

                                    <Button className='rounded-full p-6'>Signup</Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                <div className="hidden xl:flex justify-center items-center">
                    <img src={Background} alt="Background Login" className='h-[700px] ' />
                </div>
            </div>
            <div className="absolute top-4 right-4">
                <ModeToggle />
            </div>
        </div>
    )
}

export default Auth