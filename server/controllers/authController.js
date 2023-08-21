const User = require("../models/user")
const { hashPassword, comparePassword } = require("../helpers/auth")
const jwt = require("jsonwebtoken")

const test = (req, res) => {
  res.json("test is working")
}

// Register Endpoint
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // check if name was entered
    if (!name) {
      return res.json({
        error: "Name is required.",
      })
    }

    // check if email was entered
    if (!email) {
      return res.json({
        error: "Email is required.",
      })
    }

    // check if password is good
    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be at least 6 characters long.",
      })
    }

    // check email if exist
    const exist = await User.findOne({ email })

    if (exist) {
      return res.json({
        error: "Email is taken already.",
      })
    }

    // hash password
    const hashedPassword = await hashPassword(password)

    // create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    // return response
    return res.json(user)
  } catch (error) {
    console.log("Error: ", error)
  }
}

// Login Endpoint
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // check if user exist
    const user = await User.findOne({ email })

    if (!user) {
      return res.json({
        error: "No user found",
      })
    }

    // check if passwords match
    const match = await comparePassword(password, user.password)

    // code from tuts
    // if (match) {
    //   jwt.sign({ email: user.email, id: user._id, name: user.name }, process.env.JWT_SECRET, {}, (err, token) => {
    //     if (err) throw err
    //     res.cookie("token", token).json(user)
    //   })
    // } else {
    //   res.json({
    //     error: "Incorrect password",
    //   })
    // }

    // enhanced and improved by gpt
    if (match) {
      jwt.sign(
        { email: user.email, id: user._id, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }, // Set an expiration time
        (err, token) => {
          if (err) {
            console.error("JWT signing error:", err)
            return res.status(500).json({ error: "Internal server error" })
          }
          // Set the token as an HttpOnly and Secure cookie. this from gpt
          res
            // set cookies to client side to manipulate cookies in a more user-friendly way
            // .cookie("token", token, {
            //   // httpOnly: true, // Prevent JavaScript access. set to true to not be able to access or get the cookie values
            //   secure: true, // Only send over HTTPS
            //   sameSite: "strict", // Protect against CSRF attacks
            // })
            .json({ user, token })
        }
      )
    } else {
      res.json({
        error: "Incorrect password",
      })
    }
  } catch (error) {
    console.log("Error: ", error)
  }
}

// get profile
const getProfile = async (req, res) => {
  const { token } = req.cookies
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
      if (err) throw err
      res.json(user)
    })
  } else {
    res.json(null)
  }
}

module.exports = {
  test,
  registerUser,
  loginUser,
  getProfile,
}
