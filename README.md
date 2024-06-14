```markdown
# Hotel Booking Website Backend

## Overview

This repository contains the backend for a hotel booking website.
It includes features such as authentication, role-based authorization, and robust error handling.
The project is organized to ensure maintainability, scalability, and security.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt.js
- moment.js
- socket.io
- helmet
- xss-clean
- express-mongo-sanitize
- dotenv

## Folder Structure


config/                       
  db_connection.js            # Database connection setup

controllers/                  
  booking_controller.js       # Logic for booking-related routes
  hotel_controller.js         # Logic for hotel-related routes
  index.js                    # Export all controllers
  user_controller.js          # Logic for user-related routes

libs/                         
  constants/                  # Constants used across the application
  error.js                    # Custom error classes
  utils.js                    # Helper functions

middlewares/                  
  auth_middleware.js          # Authentication check
  check_admin_role.js         # Admin role validation
  check_owner_role.js         # Owner role validation
  date_validation_middleware.js # Date validation logic
  index.js                    # Export all middlewares

models/                       
  booking_model.js            # Booking schema and model
  hotel_model.js              # Hotel schema and model
  index.js                    # Export all models
  user_model.js               # User schema and model

repositories/                 
  base_repository.js          # Base repository with common methods
  bookings_repository.js      # Booking-related database operations
  hotels_repository.js        # Hotel-related database operations
  index.js                    # Export all repositories
  users_repository.js         # User-related database operations

routes/                       
  booking_router.js           # Routes for booking operations
  hotel_router.js             # Routes for hotel operations
  index.js                    # Export all routers
  user_router.js              # Routes for user operations

services/                     
  booking_services.js         # Business logic for bookings
  hotel_services.js           # Business logic for hotels
  index.js                    # Export all services
  user_services.js            # Business logic for users

uploads/                      # File uploads

.env                          # Environment variables
package-lock.json             # Dependency lock file
package.json                  # Project metadata and dependencies
server.js                     # Server setup and initialization


## Security Practices

This project is designed as an example of secure coding practices. Here are the key security measures implemented:

### JWT Authentication

- Ensures that users are authenticated before accessing protected routes.
- Each request must include a valid JWT token, which verifies the user's identity.

### Role-based Authorization

- Different roles such as `admin` and `user` have varying levels of access.
- Middleware checks ensure users have the necessary permissions to access specific routes, enhancing security by enforcing role-based access control.

### Input Validation

- Middleware functions like `date_validation_middleware.js` validate user inputs to prevent invalid data from being processed.
- Ensures data integrity and prevents common issues related to malformed input.

### Data Sanitization

- Libraries such as `xss-clean` and `express-mongo-sanitize` are used to sanitize user inputs.
- These libraries help prevent XSS (Cross-Site Scripting) and NoSQL injection attacks by cleaning the input data.

### Password Security

- `bcrypt.js` is used to hash passwords before storing them in the database, ensuring that plain-text passwords are never saved directly.
- Passwords are never included in API responses, protecting sensitive user information.

### HTTP Headers

- `helmet` is used to set secure HTTP headers, protecting the app from common vulnerabilities such as clickjacking, MIME type sniffing, and more.
- Adds an additional layer of security by configuring various HTTP headers appropriately.

### Error Handling

- Custom error classes standardize error responses, improving the clarity and consistency of error handling.
- Provides meaningful error messages to clients while hiding sensitive information that could be exploited by attackers.


## Usage

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Aman-Jot-Kaur/Hotel-Booking-Backend-Quality-Code.git
   cd Hotel-Booking-Backend-Quality-Code
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file and add the necessary environment variables.

4. **Run the server**:
   ```bash
   npm start
   ```

## Conclusion

This backend structure is designed to be scalable, maintainable, and secure, making it an excellent foundation for any hotel booking system. Enjoy building and enhancing your application!
