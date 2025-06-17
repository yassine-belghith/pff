# PFE Backend

Backend server for the PFE application built with Node.js, Express, TypeScript, and MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (v4.4 or higher) - either locally installed or a cloud instance

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Run the setup script**
   
   On macOS/Linux:
   ```bash
   ./scripts/setup.sh
   ```
   
   On Windows (using Git Bash or WSL):
   ```bash
   bash scripts/setup.sh
   ```
   
   This script will:
   - Check for required dependencies (Node.js, npm, MongoDB)
   - Install all Node.js dependencies
   - Create a `.env` file with a secure random JWT secret
   - Provide instructions for starting the server
   
   If you prefer to set up manually, follow the instructions below:
   
   **Manual Setup**
   
   1. Install dependencies:
      ```bash
      npm install
      ```
   
   2. Set up environment variables:
      - Copy the example environment file:
        ```bash
        cp .env.example .env
        ```
      - Update the `.env` file with your configuration:
        ```env
        # Server Configuration
        PORT=5001
        NODE_ENV=development
        
        # MongoDB Configuration
        MONGODB_URI=mongodb://localhost:27017/pfe_app
        
        # JWT Configuration
        JWT_SECRET=your_secure_jwt_secret_here
        ```
      - Replace `your_secure_jwt_secret_here` with a secure secret key for JWT token signing
      - Update the `MONGODB_URI` if your MongoDB instance is running on a different host or port

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The server will be available at `http://localhost:5001`

## Available Scripts

- `npm run dev` - Start the development server with hot-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code using Prettier
- `npm test` - Run tests (not implemented yet)

## Testing the API

To test the API endpoints, you can use the provided test script:

1. Make sure the server is running:
   ```bash
   npm run dev
   ```

2. In a new terminal, run the test script:
   ```bash
   ./scripts/test-api.sh
   ```

   This will test:
   - Health check endpoint
   - User registration
   - Protected route with JWT token
   - User login

   Make sure you have `curl` and `jq` installed on your system.

## Project Structure

```
src/
├── app.ts                 # Express app configuration
├── server.ts              # Server entry point
├── config/                # Configuration files
├── controllers/           # Request handlers
├── middleware/            # Custom middleware
├── models/                # Database models
├── routes/                # Route definitions
└── types/                 # TypeScript type definitions
```

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user (protected)

## Environment Variables

- `PORT` - Port to run the server on (default: 5001)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `NODE_ENV` - Application environment (development, production, test)

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## License

ISC
