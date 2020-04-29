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

//socket untuk jamak
//io untuk singular

let io = socketIO(server)

io.on('connection', (socket) => {
    console.log('new user connected')

    //saat user baru gabung, admin mengirim pesan ini ke diri sendiri
    socket.emit('newMessage',{
        from: 'Admin',
        text: 'welcome to the chat app!',
        created_at: new Date().getTime()
    })

    //saat user baru gabung, admin mengirim pesan kepada semua user yang bergabung kecuali user yang baru bergabung
    socket.broadcast.emit('newMessage',{
        from: 'Admin',
        text: 'new user joined!',
        created_at: new Date().getTime()
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
    
    socket.on('createMessage', (message) => {

        console.log(`create message:` + message)

        //broadcast kesemua
        // io.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     created_at: new Date().getTime()
        // })

        // broadcast kesemua kecuali kita
        socket.broadcast.emit('newMessage', {
            from: message.from,
            text: message.text,
            created_at: new Date().getTime()
        })

    })

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