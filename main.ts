const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const mongo = require('mongoose');
const routes = require('./src/routes');
const uniqid = require('uniqid');
const { ErrorMessages } = require('./src/utils/constants');

const app = express();
const port = process.env.APP_PORT || 8030;
const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/paystar-gateway';

// Middleware

// Enable Cross-Origin Resource Sharing (CORS) for all routes
app.use(cors());

// Parse incoming request bodies in JSON format
app.use(bodyParser.json());

// Parse incoming request bodies with urlencoded payloads
app.use(bodyParser.urlencoded({ extended: true }));

// Secure the app by setting various HTTP headers
app.use(helmet());

// Middleware to generate a unique gateway reference for every request
app.use((req: any, res: any, next: any) => {
    req.gatewayRef = uniqid();
    next();
});

// Add application routes
app.use(routes);

// Handle 404 errors for undefined routes
app.use((req: any, res: any) => {
    res.status(404).json({
        success: false,
        error: ErrorMessages.NOT_FOUND
    });
});

// Create an HTTP server
const server = http.createServer(app);

// ANSI escape codes for console text colors
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const reset = '\x1b[0m';

// Display a stylized startup message in the console
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

// Connect to the MongoDB database
mongo.connect(dbUri)
    .then(() => {
        console.log('Connected to database');

        // Start the server and listen on the specified port
        server.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    })
    .catch((err: any) => {
        console.log('Failed to connect to database', err);
    });
