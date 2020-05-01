const path = require('path')
const express = require('express')
const app = express()
const http = require('http')
const socketIO = require('socket.io')
const {generateMessage, generateLocationMessage } = require('./utils/message')
const {isRealString} = require('./utils/isRealString')
const {Users} = require('./utils/users')
//membuat filenya static
const publicPath = path.join(__dirname, '/../public')

app.use(express.static(publicPath))

let port = process.env.PORT || 3000
let server = http.createServer(app)
let users = new Users()

//socket untuk jamak
//io untuk singular

let io = socketIO(server)

io.on('connection', (socket) => {
    console.log('new user connected')

    socket.on('join', (params, callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room)){
            callback('Name and room are required')
        }
        socket.join(params.room)

        users.removeUser(socket.id)

        users.addUser(socket.id, params.name, params.room)

        io.to(params.room).emit('updateUserList', users.getUserList(params.room))

        //saat user baru gabung, admin mengirim pesan ini ke diri sendiri
        socket.emit('newMessage',generateMessage('Admin', `selamat datang di ${params.room}`))

        //saat user baru gabung, admin mengirim pesan kepada semua user yang bergabung kecuali user yang baru bergabung
        socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin', `${params.name}`))
        
        callback()
    })

    //saat user baru gabung, admin mengirim pesan kepada semua user termasuk kita
    // io.emit('newMessage',{
    //     from: 'Admin',
    //     text: 'new user joined!',
    //     created_at: new Date().getTime()
    // })

    // socket.emit('newMessage', {
    //     from: 'server', text: 'halo bro'
    // })
    
    socket.on('createMessage', (message, callback) => {
        let user = users.getUser(socket.id)

        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text))
        callback('this is from the server')
        }

        //broadcast kesemua
        // io.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     created_at: new Date().getTime()
        // })
        // io.emit('newMessage', generateMessage(message.from, message.text))
        // callback('this is from the server')

        // broadcast kesemua kecuali kita
        // socket.broadcast.emit('newMessage', generateMessage(message.from, message.text))

    })

    socket.on('createLocationMessage', (coords) => {
        //kirim ke semua kecuali diri sendiri
        // io.emit('newLocationMessage', generateLocationMessage('Admin', coords.lat, coords.lng))

        let user = users.getUser(socket.id)
        if(user){
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(`${user.name}`, coords.lat, coords.lng))
        }
    })

    socket.on('disconnect', () => {
        let user = users.removeUser(socket.id)
       
        if(user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room))

            socket.broadcast.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} meninggalkan obrolan`))

        }
        console.log('user was disconnect')
    })
})

//listen port
server.listen(`${port}`, () => {
    console.log(`server is up on port ${port}`)
})
 
// console.log(path.join(__dirname, '/../public'))
// console.log(__dirname + "/../public")