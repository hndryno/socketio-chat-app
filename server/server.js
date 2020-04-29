const path = require('path')
const express = require('express')
const app = express()

//membuat filenya static
const publicPath = path.join(__dirname, '/../public')

app.use(express.static(publicPath))

let port = process.env.PORT || 3000

//listen port
app.listen(3000, () => {
    console.log(`server is up on port ${port}`)
})
 
// console.log(path.join(__dirname, '/../public'))
// console.log(__dirname + "/../public")