// Importing the environment variables using the loadEnv module
const env = require('./loadEnv');

/**
 * User constants configuration.
 * This module exports user-related constants such as admin credentials, which are loaded from environment variables.
 */
const user = {
  ADMIN_EMAIL: env.ADMIN_EMAIL, // The email address for the admin user
  ADMIN_PASSWORD: env.ADMIN_PASSWORD // The password for the admin user
};

module.exports = { user };
