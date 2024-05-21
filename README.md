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
