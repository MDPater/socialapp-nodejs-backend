# README for Node.js Backend - Personal Social Media Project

Welcome to the backend repository for my personal project! This README provides an overview of the project, setup instructions, and key features of the backend.

---

## Project Overview

This project is a **Node.js-based backend** designed to power a personal platform in progress. It provides APIs for user authentication, and more endpoints to come. The backend is built with scalability, and maintainability in mind.

---

## Features

- **User Authentication**  
  - Sign-up, login, and logout functionality.  
  - Secure password hashing.  
  - Token-based authentication with **JWT**.

- **Data Storage**  
  - SQLite db to store users.

---

## Prerequisites

Before setting up the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) 
- [npm](https://www.npmjs.com/) for dependency management

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MDPater/socialapp-nodejs-backend.git
   cd socialapp-nodejs-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:  
   Create a `.env` file in the root directory and configure the following:
   ```env
   PORT=3000
   JWTSECRET=your_secret_key
   JWT_EXPIRATION_IN_SECONDS=
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Run in production mode**:
   ```bash
   npm start
   ```

---

## API Endpoints

| Method | Endpoint             | Description               |
|--------|----------------------|---------------------------|
| POST   | `/auth/register` | Register a new user       |
| POST   | `/auth/login`    | Log in an existing user   |
| GET    | `/status`     | status for server         |



---

## Contributing

Contributions are welcome! Follow these steps:  
1. Fork the repository.  
2. Create a new feature branch: `git checkout -b feature-name`.  
3. Commit your changes: `git commit -m 'Add feature-name'`.  
4. Push the branch: `git push -u origin feature-name`.  
5. Submit a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

For questions or suggestions, reach out to me at **dev.maxdepater@gmail.com**.  

Happy coding! 🚀
