import { createContext, useEffect, useState } from "react"

export const ThemeContext = createContext()

export const ThemeContextProvider = ({
    children,
    defaultTheme = "dark",
    storageKey = "vite-ui-theme",
    ...props
}) => {
    const [theme, setTheme] = useState("light" || defaultTheme)

    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove("light", "dark")
        root.classList.add(theme)
        console.log(root);

    }, [theme])

    const themeContextValue = {
        theme,
        setTheme: (theme) => {
            localStorage.setItem(storageKey, theme)
            setTheme(theme)
        },
    }
    return (
        <ThemeContext.Provider {...props} value={themeContextValue}>
            {children}
        </ThemeContext.Provider>
    )
}