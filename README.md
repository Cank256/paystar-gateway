# Paystar Gateway

A payment gateway to handle payments for the Paystar Application. It consumes the Flutterwave mobile money and Card payments API.

## Technologies used
- Bun Runtime v1.1.7
- MongoDB
- Flutterwave Mobile Money and Card Payments API

## Setup
- Clone the repository
```bash
git clone https://github.com/Cank256/paystar-gateway.git
cd paystar-gateway
```

- Install dependencies:

```bash
bun install
```

- Rename the .env.example file to .env for the environment variables
```bash
cp .env.example .env
```

- Fill in the correct values for the avariables in the .env file
```bash
APP_PORT=8030

FLUTTEWAV_API_URL="https://api.flutterwave.com/v3/payments"
FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_public_key
FLUTTERWAVE_SECRET_KEY=your_flutterwave_secret_key

MONGODB_URI=your_mongodb_connection_uri
```

- Run the application (in Dev / Watch mode):

```bash
bun dev
```
## Project Structure
The project is structured as follows:
```bash
.
├── LICENSE
├── README.md
├── code_of_conduct.md
├── contributing.md
├── main.ts
├── package.json
├── src
│   ├── controllers
│   │   └── paymentsController.ts
│   ├── middleware
│   │   └── validationMiddleware.ts
│   ├── models
│   │   └── transactionsModel.ts
│   ├── routes
│   │   ├── index.ts
│   │   └── paymentRoutes.ts
│   ├── services
│   │   └── paymentsService.ts
│   └── utils
│       ├── constants.ts
│       └── utils.ts
└── tsconfig.json
```

## Dependencies
The application relies on several key dependencies:
- body-parse: Middleware for parsing request bodies.
- cors: Middleware for enabling Cross-Origin Resource Sharing.
- express: Web framework for building RESTful APIs.
- flutterwave-node-v3: Node.js SDK for interacting with Flutterwave's API.
- helmet: Middleware for securing Express apps by setting various HTTP headers.
- http: Node.js core module for HTTP functionality.
- mongoose: ODM for MongoDB.
- phone: Utility for phone number validation and formatting.
- uniqid: Library for generating unique IDs.

## Contributing

Contributions are always welcome!

See `contributing.md` file in each of the application folders for ways to get started.

Please adhere to this project's `code of conduct`.


## Authors

- [Caleb Nkunze](https://www.github.com/Cank256)


## License

This project is licensed under the [MIT License](LICENSE).

Feel free to explore the codebase, contribute, and make PayStar even better!
