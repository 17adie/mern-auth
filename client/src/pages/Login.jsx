import { useState, useContext } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../../context/userContext"
import { useCookies } from "react-cookie"

export default function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const { setCookie } = useContext(UserContext)

  const loginUser = async (e) => {
    e.preventDefault()
    const { email, password } = formData
    try {
      const { data } = await axios.post("/auth/login", { email, password })
      if (data.error) {
        toast.error(data.error)
      } else {
        setCookie("token", data.token, {
          // maxAge: 900000, // 15mins
          path: "/",
          secure: true, // Set secure attribute
          sameSite: "strict", // Set sameSite attribute to strict
        })
        setFormData({}) // reset form
        navigate("/dashboard")
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <form onSubmit={loginUser}>
        <label htmlFor="email">email</label>
        <input id="email" type="email" placeholder="Enter Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />

        <label htmlFor="password">password</label>
        <input id="password" type="password" placeholder="Enter Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />

        <button type="submit">Submit</button>
      </form>
    </div>
  )
}
