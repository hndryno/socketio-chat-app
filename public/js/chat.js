let socket = io()

socket.on('connect', () => {
    let searchQuery = window.location.search.substring(1)
    let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, '').replace(/=/g, '":"') + '"}')

    socket.emit('join', params, function(err){
        if(err){
            alert(err)
            window.location.href = '/'
        }else{
            console.log('No Error')
        }
    })
    console.log('connected to the server')
    // socket.emit('createMessage', {
    //     from: 'WDJ',
    //     text: 'whats goin on'
    // })
})

function scrollToBottom(){
    let messages = document.querySelector('#messages').lastElementChild
    messages.scrollIntoView()
}

socket.on('disconnect', () => {
    console.log('disconnected from server')
})

socket.on('newMessage', (message) => {
    const formattedTime = moment(message.createdAt).format('LT')
    const template = document.querySelector('#message-template').innerHTML

    const html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: formattedTime
    })

    const div = document.createElement('div')
    div.innerHTML = html

    document.querySelector(
        '#messages'
    ).appendChild(div)
    
    scrollToBottom()
    
    // const formattedTime = moment(message.createdAt).format('LT')
    // console.log('new message', message)
    // let li = document.createElement('li')
    // li.innerText = `${message.from} ${formattedTime}: ${message.text}`

    // document.querySelector(
    //     'body'
    // ).appendChild(li)
})

socket.on('newLocationMessage', (message) => {
    const formattedTime = moment(message.createdAt).format('LT')
    const template = document.querySelector('#location-message-template').innerHTML

    const html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    })

    const div = document.createElement('div')
    div.innerHTML = html

    document.querySelector(
        '#messages'
    ).appendChild(div)

    scrollToBottom()
    // const formattedTime = moment(message.createdAt).format('LT')
    // console.log("location message: ", message)
    // let li = document.createElement('li')
    // let a = document.createElement('a')
    // li.innerText = `${message.from} ${formattedTime}: `
    // a.setAttribute('target', '_blank')
    // a.setAttribute('href', message.url)
    // a.innerText = 'Lokasi Anda'
    // li.appendChild(a)
    
    // document.querySelector('body').appendChild(li)
})

// socket.emit('createMessage', {
//     from: 'Hendri',
//     text: 'Hello bro!'
// }, function (message) {
//     console.log(`Got the ${message}`)
// })

socket.on('updateUserList', function(users){
    let ol = document.createElement('ol')

    users.forEach(user => {
        let li = document.createElement('li')
        li.innerHTML = user
        ol.appendChild(li)        
    });

    let usersList = document.querySelector('#users')
    usersList.innerHTML = ''
    usersList.appendChild(ol)
})

document.querySelector('#submitBtn').addEventListener('click', function(e){
    e.preventDefault()

    socket.emit("createMessage", {
        text: document.querySelector(
            'input[name="message"]'
        ).value
    }, function (){

    })
})

document.querySelector('#sendLocation').addEventListener('click', function(e){
    if(!navigator.geolocation){
        return alert('browsermu tidak support geolocation')
    }

    navigator.geolocation.getCurrentPosition(function (position){
        socket.emit('createLocationMessage', {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        })
    }, function (){
        alert('unable to fetch location')
    })
})