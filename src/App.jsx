import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Chat from '@/pages/chat'
import Auth from '@/pages/auth'
import Profile from '@/pages/profile'
import { useAppStore } from '@/store'
import { useEffect, useState } from 'react'
import { ImSpinner2 } from "react-icons/im";
import apiClient from './lib/api-client'
import { GET_USER_INFO } from './utils/constants'
import PropTypes from 'prop-types';

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore()
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to={'/auth'} />
}

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore()
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to={'/chat'} /> : children
}

AuthRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

const App = () => {
  const { userInfo, setUserInfo } = useAppStore()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await apiClient.get(GET_USER_INFO, { withCredentials: true })
        if (res.status === 200) {
          setUserInfo(res.data.user)
        } else {
          setUserInfo(undefined)
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false)
      }
    }
    if (!userInfo) {
      getUserData()
    } else {
      setLoading(false)
    }
  }, [userInfo, setUserInfo])

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 w-full h-screen bg-[#1c1d25] text-white text-3xl">
        <span>Loading...</span>
        <ImSpinner2 className='animate-spin' />
      </div>
    )
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/chat' element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path='/auth' element={<AuthRoute><Auth /></AuthRoute>} />
        <Route path='/profile' element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path='/*' element={<Navigate to={'/auth'} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App