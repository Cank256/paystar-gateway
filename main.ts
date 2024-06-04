const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const helmet = require('helmet')
const http = require('http')
const mongo = require('mongoose')
const routes = require('./src/routes')
const uniqid = require('uniqid')

const { ErrorMessages } = require('./src/utils/constants')

const app = express()
const port = Bun.env.APP_PORT || 8030
const dbUri = Bun.env.MONGODB_URI || 'mongodb://localhost:27017/paystar-gateway'

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(helmet())

// Generate a gateway ref for every request
app.use((req: any, res: any, next: any) => {
    req.gatewayRef = uniqid()
    next()
})

// Add Routes
app.use(routes)

// Handle 404 Error
app.use((req: any, res: any) => {
    res.status(404).json({
        success: false,
        error: ErrorMessages.NOT_FOUND
    })
})

// Create server
const server = http.createServer(app)

// ANSI escape codes for colors
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const reset = '\x1b[0m';

console.log(
    `${green}
    ██████╗  █████╗ ██╗   ██╗███████╗████████╗ █████╗ ██████╗
    ██╔══██╗██╔══██╗██║   ██║██╔════╝╚══██╔══╝██╔══██╗██╔══██╗
    ██████╔╝███████║██║██ ██║███████╗   ██║   ███████║██████╔╝
    ██╔═══╝ ██╔══██║╚══██║══╝ ╚═══██║   ██║   ██╔══██║██╔══██║
    ██║     ██║  ██║   ██║   ███████║   ██║   ██║  ██║██║    ██║  
    ╚═╝     ╚═╝  ╚═╝   ╚═╝   ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝    ╚═╝
    ${reset}
    ${yellow}Your payment solution${reset}`
);

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

