const express = require("express")
const dotenv = require("dotenv").config()
const cors = require("cors")
const authRouters = require("./routes/authRoutes")
const { mongoose } = require("mongoose")
const cookieParser = require("cookie-parser")

// database connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log("Error: ", err))

// initialize app
const app = express()

// middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.use("/auth", authRouters)

const port = 8000
app.listen(port, () => console.log(`Server is running in port ${port}`))
