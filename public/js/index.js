let socket = io()

socket.on('connect', () => {
    console.log('connected to the server')
    // socket.emit('createMessage', {
    //     from: 'WDJ',
    //     text: 'whats goin on'
    // })
})

socket.on('disconnect', () => {
    console.log('disconnected from server')
})

socket.on('newMessage', (message) => {
    console.log('new message', message)
})