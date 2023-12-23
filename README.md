# Forum API

[![Continuos Integration](https://github.com/muhariananda/forum-api/actions/workflows/ci.yaml/badge.svg)](https://github.com/muhariananda/forum-api/actions/workflows/ci.yaml)

---

## Overview

Forum API is a RESTful API built using Javascript and Node.js, leveraging the Hapi framework. It provides features for creating user accounts, managing threads, adding comments, liking comments, and replying to comments. The project utilizes PostgreSQL as a relational database, JWT for authentication, and follows the principles of clean architecture.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)

## Technologies Used

- JavaScript : The primary programming language
- [Node.js](https://nodejs.org/en) : The runtime environment for executing JavaScript code.
- [Hapi Framework](https://hapi.dev/) : A powerful and flexible framework for building web applications.
- [PostgreSQL](https://www.postgresql.org/) (Relational Database) : A relational database management system for data storage.
- [JWT](https://en.wikipedia.org/wiki/JSON_Web_Token) (JSON Web Tokens) for User Authentication

## Features

- **User Accounts:**
  - Create user accounts with secure authentication using JWT.

- **Threads:**
  - Create and manage discussion threads.

- **Comments:**
  - Add comments to threads.
  - Like comments.
  - Reply to comments.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/muhariananda/forum-api.git
   cd forum-api
   ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Database setup**
    - Create a PostgreSQL databases for application and test, then update the configuration in `config/database.js`.

4. **Environment variables**
    - Create a `.env` file based on the `.env.example` file and configure the required variables.

5. **Run Migration**

    ```bash
    npm run migrate up
    ```

6. **Run the application**

    ```bash
    npm run start
    ```

## Usage

1. **Authentication**
    - Obtain a JWT token by authenticating with your user credentials.

2. **API Endpoint**
    - Refer to the [API documentation](docs/api.md) for detailed information on available endpoints and their usage.

## Testing

The project includes both unit tests and integration tests, following Test-driven Development (TDD) practices.

- Run migration for database test

    ```bash
    npm run migrate:test up
    ```

- Run test

    ```bash
    npm run test
    ```

- Run test coverage and watch

    ```bash
    npm run test:watch
    ```

---

Happy coding! ❤️ 🖥️
