const path = require('path')
const express = require('express')
const app = express()
const http = require('http')
const socketIO = require('socket.io')

//membuat filenya static
const publicPath = path.join(__dirname, '/../public')

app.use(express.static(publicPath))

let port = process.env.PORT || 3000
let server = http.createServer(app)
let io = socketIO(server)

io.on('connection', (socket) => {
    console.log('new user connected')

    socket.on('disconnect', (socket) => {
        console.log('user was disconnect')
    })
})

//listen port
server.listen(`${port}`, () => {
    console.log(`server is up on port ${port}`)
})
 
// console.log(path.join(__dirname, '/../public'))
// console.log(__dirname + "/../public")