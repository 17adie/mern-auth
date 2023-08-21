import { Link } from "react-router-dom"
import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom"

export default function Navbar() {
  const [cookies, setCookies, removeCookie] = useCookies(["token"])
  const navigate = useNavigate()

  const logout = () => {
    // setCookies("token", "") // to clear the value
    removeCookie("token") // to remove entire row of cookie
    navigate("/")
  }

  return (
    <nav>
      <Link to="/">Home</Link>
      {!cookies.token ? (
        <>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </>
      ) : (
        <button onClick={logout}>Logout</button>
      )}
    </nav>
  )
}
