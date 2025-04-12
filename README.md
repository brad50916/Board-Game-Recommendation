# Chat App

This is a real-time chat application built using the PERN stack (PostgreSQL, Express.js, React.js, Node.js) and Material-UI (MUI). The application includes user authentication via JWT, user profile management, and instant messaging capabilities using Socket.io.

[Live Demo](https://brad50916.github.io/chatweb/#/)

## Features

- **User Authentication**: Sign up and sign in using JWT-based authentication.
- **User Search**: Search for other users by their username.
- **Instant Messaging**: Chat with other users instantly using Socket.io.
- **Profile Viewing**: View other users' profiles.
- **Profile Modification**: Modify your own profile.
- **Sign Out**: Sign out from the application.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: React.js, Material-UI (MUI)
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT)
- **Real-time Communication**: Socket.io

## Getting Started

### Prerequisites

- Node.js and pnpm installed
- PostgreSQL installed and running

### Installation

1. **Clone the repository**:
    ```sh
    git clone https://github.com/brad50916/chatweb.git
    cd chatweb
    ```

2. **Backend Setup**:
    - Navigate to the `server` directory:
      ```sh
      cd server
      ```
    - Install dependencies:
      ```sh
      pnpm install
      ```
    - Create a `.env` file and add the following environment variables:
      ```env
      DB_USER = your_database_user
      DB_HOST = your_database_host
      DB_NAME = your_database_name
      DB_PASSWORD = your_database_password
      DB_PORT = your_database_port
      GITHUB_CLIENT_URL = your_frontend_address
      ```
    - Run database migrations:
      ```sh
      pnpm sequelize-cli db:migrate
      ```
    - Start the backend server:
      ```sh
      pnpm start
      ```

3. **Frontend Setup**:
    - Navigate to the `client` directory:
      ```sh
      cd ../client
      ```
    - Install dependencies:
      ```sh
      pnpm install
      ```
    - Create a `.env` file and add the following environment variables:
      ```env
      VITE_API_URL = http://localhost:3000
      ```
    - Start the frontend development server:
      ```sh
      pnpm dev
      ```

## Usage

1. **Sign Up**: Create a new account.
2. **Sign In**: Log in with your credentials.
3. **Search Users**: Use the search functionality to find other users by their username.
4. **Chat**: Start a real-time chat with other users.
5. **View Profiles**: Check out other users' profiles.
6. **Edit Profile**: Modify your own profile information.
7. **Sign Out**: Log out from your account.

## Project Structure

## Contact

For any questions or feedback, please contact [brad50916@gmail.com].