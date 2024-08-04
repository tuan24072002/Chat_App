import ReactDOM from 'react-dom/client'
import './index.css'
import { Toaster } from "@/components/ui/sonner"
import App from '@/App'
import { SocketProvider } from './context/SocketContext'
import { ThemeContextProvider } from './context/ThemeContext'
ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <ThemeContextProvider defaultTheme='light' storageKey='vite-ui-theme'>
    <SocketProvider>
      <App />
      <Toaster closeButton />
    </SocketProvider>
  </ThemeContextProvider>
  // </React.StrictMode>
)
