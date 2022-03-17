require('dotenv').config()
const express = require('express')
const app = express()
const http = require('http')
const morgan = require('morgan')
const cors = require('cors')
const PORT = process.env.PORT || 4000

const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server({
    cors : {
        origin : `${process.env.FRONT_END_URL}`
    }
})

// import local libs
const version1 = require('./src/v1/routes')
const {handleURLNotFound, errorHandling} = require('./src/v1/helper/common')

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

// routes
app.use('/v1', version1)
app.use('/file', express.static('./src/uploads'))

// url not fould
app.use(handleURLNotFound)

// error handling
app.use(errorHandling)

// web socket
io.on("connection", (socket) => {
    console.log("a user is connected")
    socket.on("disconnect", () => {
        console.log("a user is disconnected")
    })
})

io.listen(server)

server.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`)
})