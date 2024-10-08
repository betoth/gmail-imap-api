const { user } = require('../config/constants');

/**
 * Users module that stores user credentials for automation testing.
 * This module centralizes the data of users used in different test scenarios.
 * It retrieves the credentials from environment variables and maintains consistency across the test suite.
 */
const Users = {
  /**
   * Admin user object containing the username, email, and password.
   * These values are fetched from environment variables to ensure security and flexibility.
   */
  admin: {
    username: 'Admin',
    email: user.ADMIN_EMAIL,
    password: user.ADMIN_PASSWORD,
  },
};

module.exports = { Users };
