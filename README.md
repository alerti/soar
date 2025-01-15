# SOAR BACKEND DEVELOPER TECHNICAL CHALLENGE

## Table of Contents
1. [Overview](#overview)
2. [Directory Structure](#directory-structure)
3. [Project Setup Instructions](#project-setup-instructions)
   1. [Use the Deployed APIs (Optional)](#use-the-deployed-apis-optional)
   2. [Local Setup Instructions](#local-setup-instructions)
      1. [Step 1: Install Node.js](#step-1-install-nodejs)
      2. [Step 2: Install Redis](#step-2-install-redis)
      3. [Step 3: Setup MongoDB Atlas](#step-3-setup-mongodb-atlas)
      4. [Step 4: Clone the Project Repository](#step-4-clone-the-project-repository)
      5. [Step 5: Install Dependencies](#step-5-install-dependencies)
      6. [Step 6: Configure Environment Variables](#step-6-configure-environment-variables)
      7. [Step 7: Run Tests](#step-7-run-tests)
      8. [Step 8: Start the Application](#step-8-start-the-application)
   3. [Full Application Workflow](#full-application-workflow)
4. [API Documentation](#api-documentation)
   1. [User Endpoints](#user-endpoints)
   2. [School Endpoints](#school-endpoints)
   3. [Classroom Endpoints](#classroom-endpoints)
   4. [Student Endpoints](#student-endpoints)
5. [Notes](#notes)

---

## Overview
This repository contains the **Soar School Management System**, providing RESTful APIs to manage users, schools, classrooms, and students. It demonstrates role-based access control, rate-limiting, and how to integrate MongoDB and Redis.

---

## Directory Structure
- **`routes/`**
  Defines the API endpoints.

- **`managers/`**
  Houses business logic and data management for different entities:
  - **`managers/entities/user/`**
  - **`managers/entities/school/`**
  - **`managers/entities/classroom/`**
  - **`managers/entities/student/`**

- **`mws/`**
  Middleware for authentication and role-based access control.

- **`rate-limiting/`**
  Implements IP-based rate-limiting (default: 100 requests per 15 minutes).

- **`tests/`**
  Includes unit and integration tests:
  - **`tests/unit/`**
  - **`tests/integration/`**

- **`mochawesome-report/`**
  Stores Mochawesome test reports.

- **`database-design-schema-diagram/`**
  Schema diagram for all entities.

- **`soar_collection.json`**
  Postman collection for all endpoints (both local & deployed).

- **`Test-Coverage.png`**
  Displays overall endpoint coverage.

---

## Project Setup Instructions

### Use the Deployed APIs (Optional)
If you prefer not to install locally:

- **Base URL**: []()
- Integrated with **MongoDB Atlas** and **Redis Labs**.
- For quick testing of all endpoints, use the `soar_collection.json` under the development folder.

#### Testing with Postman

1. **Install Postman**:
   - Download and install [Postman](https://www.postman.com/downloads/) if you haven't already.

2. **Import the Postman Collection**:
   - Open Postman.
   - Click on `Import` in the top-left corner.
   - Select the `soar_collection.json` file located in the `development` folder.
   - Click `Import` to add the collection to your Postman workspace.

3. **Set Up Environment Variables**:
   - In Postman, go to the `Environments` tab.
   - Create a new environment named `Soar API`.
   - Add the following variables:
     - `base_url` : `http://localhost:3000` (or your deployed API URL)
     - `token` : `your_authentication_token` (to be set after logging in)

4. **Authenticate and Obtain Token**:
   - In the imported collection, find the `Authenticate a User` request.
   - Send a `POST` request with your user credentials.
   - Copy the returned `token` from the response.
   - In the `Soar API` environment, set the `token` variable with this value.

5. **Use the Token in Requests**:
   - Ensure that the `Authorization` header is set to `Bearer {{token}}` in the collection's pre-request script or individually in each request.

6. **Run the Collection**:
   - Select the `Soar API` environment.
   - Click on the collection and choose `Run Collection`.
   - Execute the requests and verify the responses.

---

## Local Setup Instructions

### Step 1: Install Node.js
1. Install [Node.js](https://nodejs.org/en/download/).
2. Verify with:
   ```shell
   node -v
   ```

### Step 2: Install Redis
1. Install [Redis](https://redis.io/download).
2. Start Redis:
   ```shell
   redis-server
   ```
3. Check it:
   ```shell
   redis-cli ping
   ```
   Expect a `PONG` if running.

4. Sign up for a service [Redis Cloud](https://redis.com/try-free/) or [AWS ElastiCache](https://aws.amazon.com/elasticache/).
5. Obtain your Redis connection string, e.g. `redis://:password@host:port`.
6. Use this string for `CACHE_REDIS` in `/config/envs/local.js`.

### Step 3: Setup MongoDB Atlas
1. Create a MongoDB Atlas cluster at https://cloud.mongodb.com/.
2. Obtain your **connection string**, such as:
   ```
   mongodb+srv://<username>:<password>@<clustername>.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```
3. Set this value in `MONGO_URI` within `/config/envs/local.js`.

### Step 4: Clone the Project Repository
```shell
git clone <git-repository-url>
cd soar-backend-developer-technical-challenge
```

### Step 5: Install Dependencies
```shell
npm install
```

### Step 6: Configure Environment Variables
1. Create a `.env` file in the root directory.
2. Add the following variables:
   ```
   MONGO_URI=<your_atlas_connection_string>
   CACHE_REDIS=<your_redis_connection_string>
   CORTEX_REDIS=<your_cortex_redis_connection_string>
   JWT_SECRET=<your_jwt_secret>
   LONG_TOKEN_SECRET=<your_long_token_secret>
   SHORT_TOKEN_SECRET=<your_short_token_secret>
   NACL_SECRET=<your_nacl_secret>
   USER_PORT=<desired_port>
   ```
3. Ensure that `.env` is listed in `.gitignore` to prevent it from being committed.

```shell
# Example `.env` file
MONGO_URI=mongodb+srv://<username>:<password>@<clustername>.mongodb.net/<dbname>?retryWrites=true&w=majority
CACHE_REDIS=redis://:<password>@<host>:<port>
CORTEX_REDIS=redis://:<password>@<host>:<port>
JWT_SECRET=your_jwt_secret
LONG_TOKEN_SECRET=your_long_token_secret
SHORT_TOKEN_SECRET=your_short_token_secret
NACL_SECRET=your_nacl_secret
USER_PORT=3000
```

### Step 7: Run Tests
```shell
npm test
```

### Step 8: Start the Application
```shell
node app.js local
```
The server runs at `http://localhost:3000`.

---

## Full Application Workflow
1. **Set Up a Superadmin User**: Has global access.
2. **Authenticate Superadmin**: Obtain token.
3. **Create Schooladmin**: Superadmin can create a new schooladmin.
4. **Authenticate Schooladmin**: Obtain token.
5. **Create a School**: Superadmins only. Assign a schooladmin.
6. **Link Schooladmin to School**: Ensures schooladmin can manage resources.
7. **Manage Classrooms/Students**: Schooladmin can create, update, or delete.
8. **Transfer Students**: If target classroom is full, transfer fails.

---

## API Documentation

### User Endpoints

#### Register a New User
- **Endpoint**: `POST /api/users/register`
- **Request**:
   ```json
   {
     "username": "string",
     "email": "string",
     "password": "string",
     "role": "superadmin | schooladmin | user"
   }
   ```
- **Response**:
   ```json
   {
     "user": {
       "_id": "string",
       "username": "string",
       "email": "string",
       "role": "string",
       "school": "object or null"
     }
   }
   ```

#### Authenticate a User
- **Endpoint**: `POST /api/users/login`
- **Roles**: All
- **Request**:
   ```json
   {
     "email": "string",
     "password": "string"
   }
   ```
- **Response**:
   ```json
   {
     "token": "string"
   }
   ```

#### Update a User
- **Endpoint**: `PUT /api/users/:id`
- **Roles**: Superadmin
- **Request**:
   ```json
   {
     "username": "string",
     "email": "string",
     "password": "string",
     "role": "string",
     "school": "string or null"
   }
   ```
- **Response**:
   ```json
   {
     "_id": "string",
     "username": "string",
     "email": "string",
     "role": "string",
     "school": "object or null"
   }
   ```

#### Delete a User
- **Endpoint**: `DELETE /api/users/:id`
- **Roles**: Superadmin
- **Response**: No content

#### Get All Users
- **Endpoint**: `GET /api/users`
- **Roles**: Superadmin
- **Response**:
   ```json
   [
     {
       "_id": "string",
       "username": "string",
       "email": "string",
       "role": "string",
       "school": "object or null"
     }
   ]
   ```

#### Get User by ID
- **Endpoint**: `GET /api/users/:id`
- **Roles**: Superadmin
- **Response**:
   ```json
   {
     "_id": "string",
     "username": "string",
     "email": "string",
     "role": "string",
     "school": "object or null"
   }
   ```

---

### School Endpoints

#### Create a New School
- **Endpoint**: `POST /api/schools`
- **Roles**: Superadmin
- **Request**:
   ```json
   {
     "name": "string",
     "address": "string",
     "phone": "string",
     "email": "string",
     "website": "string",
     "established": "YYYY-MM-DD",
     "admin": "string (user ObjectId)"
   }
   ```
- **Response**:
   ```json
   {
     "_id": "string",
     "name": "string",
     "address": "string",
     "phone": "string",
     "email": "string",
     "website": "string",
     "established": "YYYY-MM-DD",
     "admin": "object"
   }
   ```

#### Get All Schools
- **Endpoint**: `GET /api/schools`
- **Roles**: Superadmin
- **Response**:
   ```json
   [
     {
       "_id": "string",
       "name": "string",
       "address": "string",
       "phone": "string",
       "email": "string",
       "website": "string",
       "established": "YYYY-MM-DD",
       "admin": "object"
     }
   ]
   ```

#### Get School by ID
- **Endpoint**: `GET /api/schools/:id`
- **Roles**: Superadmin
- **Response**:
   ```json
   {
     "_id": "string",
     "name": "string",
     "address": "string",
     "phone": "string",
     "email": "string",
     "website": "string",
     "established": "YYYY-MM-DD",
     "admin": "object"
   }
   ```

#### Update a School
- **Endpoint**: `PUT /api/schools/:id`
- **Roles**: Superadmin
- **Request**:
   ```json
   {
     "name": "string",
     "address": "string",
     "phone": "string",
     "email": "string",
     "website": "string",
     "established": "YYYY-MM-DD",
     "admin": "string (user ObjectId)"
   }
   ```
- **Response**:
   ```json
   {
     "_id": "string",
     "name": "string",
     "address": "string",
     "phone": "string",
     "email": "string",
     "website": "string",
     "established": "YYYY-MM-DD",
     "admin": "object"
   }
   ```

#### Delete a School
- **Endpoint**: `DELETE /api/schools/:id`
- **Roles**: Superadmin
- **Response**: No content

---

### Classroom Endpoints

#### Create a New Classroom
- **Endpoint**: `POST /api/classrooms`
- **Roles**: Superadmin or Schooladmin
- **Request**:
   ```json
   {
     "name": "string",
     "school": "string (school ObjectId)",
     "capacity": 30,
     "resources": ["Projector", "Whiteboard"]
   }
   ```
- **Response**:
   ```json
   {
     "_id": "string",
     "name": "string",
     "school": {
       "_id": "string",
       "name": "string"
     },
     "capacity": 30,
     "resources": ["Projector", "Whiteboard"]
   }
   ```

#### Get All Classrooms
- **Endpoint**: `GET /api/classrooms`
- **Roles**: Superadmin or Schooladmin
- **Response**:
   ```json
   [
     {
       "_id": "string",
       "name": "string",
       "school": {
         "_id": "string",
         "name": "string"
       },
       "capacity": 40,
       "resources": ["Projector", "Whiteboard"]
     }
   ]
   ```

#### Get Classroom by ID
- **Endpoint**: `GET /api/classrooms/:id`
- **Roles**: Superadmin or Schooladmin
- **Response**:
   ```json
   {
     "_id": "string",
     "name": "string",
     "school": {
       "_id": "string",
       "name": "string"
     },
     "capacity": 30,
     "resources": ["Projector", "Whiteboard"]
   }
   ```

#### Update a Classroom
- **Endpoint**: `PUT /api/classrooms/:id`
- **Roles**: Superadmin or Schooladmin
- **Request**:
   ```json
   {
     "name": "string",
     "capacity": 35,
     "resources": ["Computers", "Projector"]
   }
   ```
- **Response**:
   ```json
   {
     "_id": "string",
     "name": "string",
     "school": {
       "_id": "string",
       "name": "string"
     },
     "capacity": 35,
     "resources": ["Computers", "Projector"]
   }
   ```

#### Delete a Classroom
- **Endpoint**: `DELETE /api/classrooms/:id`
- **Roles**: Superadmin or Schooladmin
- **Response**: No content

---

### Student Endpoints

#### Create a New Student
- **Endpoint**: `POST /api/students`
- **Roles**: Superadmin or Schooladmin
- **Request**:
   ```json
   {
     "name": "John Doe",
     "email": "john@soartest.com",
     "classroom": "string (classroom ObjectId)",
     "age": 16,
     "address": "123 Main Street"
   }
   ```
- **Response**:
   ```json
   {
     "_id": "string",
     "name": "John Doe",
     "email": "john@soartest.com",
     "classroom": {
       "_id": "string",
       "name": "Class A"
     },
     "age": 16,
     "address": "123 Main Street"
   }
   ```

#### Get All Students
- **Endpoint**: `GET /api/students`
- **Roles**: Superadmin or Schooladmin
- **Response**:
   ```json
   [
     {
       "_id": "string",
       "name": "Jane Smith",
       "email": "jane@soartest.com",
       "classroom": {
         "_id": "string",
         "name": "Class B"
       },
       "age": 15,
       "address": "456 Elm Street"
     }
   ]
   ```

#### Get Students by Classroom ID
- **Endpoint**: `GET /api/students/classrooms/:classroomId`
- **Roles**: Superadmin or Schooladmin
- **Response**:
   ```json
   [
     {
       "_id": "string",
       "name": "Mark Twain",
       "email": "mark@soartest.com",
       "classroom": {
         "_id": "string",
         "name": "Class C"
       },
       "age": 17,
       "address": "789 Maple Street"
     }
   ]
   ```

#### Get Student by ID
- **Endpoint**: `GET /api/students/:id`
- **Roles**: Superadmin or Schooladmin
- **Response**:
   ```json
   {
     "_id": "string",
     "name": "Alice Johnson",
     "email": "alice@soartest.com",
     "classroom": {
       "_id": "string",
       "name": "Class D"
     },
     "age": 16,
     "address": "321 Pine Street"
   }
   ```

#### Update a Student
- **Endpoint**: `PUT /api/students/:id`
- **Roles**: Superadmin or Schooladmin
- **Request**:
   ```json
   {
     "name": "Alice Updated",
     "email": "alice.updated@soartest.com",
     "age": 17,
     "address": "Updated Address"
   }
   ```
- **Response**:
   ```json
   {
     "_id": "string",
     "name": "Alice Updated",
     "email": "alice.updated@soartest.com",
     "classroom": {
       "_id": "string",
       "name": "Class D"
     },
     "age": 17,
     "address": "Updated Address"
   }
   ```

#### Delete a Student
- **Endpoint**: `DELETE /api/students/:id`
- **Roles**: Superadmin or Schooladmin
- **Response**: No content

---

## Notes
All delete operations result in permanent removal from the database (no soft deletes).
