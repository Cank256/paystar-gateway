const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const helmet = require('helmet')
const http = require('http')
const mongo = require('mongoose')

const app = express()
const port = Bun.env.APP_PORT || 8030
const dbUri = Bun.env.MONGODB_URI || 'mongodb://localhost:27017/paystar-gateway'

app.use(cors)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(helmet)

const server = http.createServer(app)

mongo.connect(dbUri)
    .then(() => {
        console.log('Connected to database')
        server.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`)
        })
    })
    .catch((err: any) => {
        console.log('Failed to connect to database', err)
    })
