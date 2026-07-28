require('dotenv').config()
const express = require('express')

const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')


const app = express()
const PORT = process.env.PORT || 3500


connectDB()

app.use(express.json())
app.use('/register', require('./routes/register'))

mongoose.connection.once('open',() =>{
    console.log("Connected to mongoDB");
    app.listen(PORT,()=> console.log(`Server running on port ${PORT}`))
})