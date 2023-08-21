import axios from "axios"
import { createContext, useState, useEffect } from "react"
import { useCookies } from "react-cookie"

export const UserContext = createContext({})

export function UserContextProvider({ children }) {
  const [cookies, setCookie] = useCookies(["token"])
  const [user, setUser] = useState(null)

  useEffect(() => {
    console.log("context use effect")
    if (cookies.token) {
      axios.get("/auth/profile").then(({ data }) => {
        console.log(data)
        setUser(data)
      })
    }
  }, [cookies.token]) // run this every cookies change

  return <UserContext.Provider value={{ user, setUser, setCookie }}>{children}</UserContext.Provider>
}
