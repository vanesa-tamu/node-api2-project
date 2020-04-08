const express = require('express')
const server = express()

const posts = require('./postsRouter.js')
server.use(express.json())

server.use('/api/posts', posts)

const port = 6000
server.listen(port, () => console.log(`Running: port ${port}!`))