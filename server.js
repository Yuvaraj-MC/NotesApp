require('dotenv').config()
const express = require('express')
const verifyJWT = require('./middleware/verifyJWT')

const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')


const app = express()
const PORT = process.env.PORT || 3500



connectDB()

//middleware
app.use(express.json())
app.use(cookieParser())



// routes 

app.use('/register', require('./routes/register'))//create account
app.use('/auth', require('./routes/auth'))//this is for login we will get access token
app.use('/refresh',require('./routes/refresh'))





app.use(verifyJWT)
app.use('/notes',require('./routes/notes'))






mongoose.connection.once('open',() =>{
    console.log("Connected to mongoDB");
    app.listen(PORT,()=> console.log(`Server running on port ${PORT}`))
})