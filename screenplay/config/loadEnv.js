const path = require('path');
const dotenv = require('dotenv');

/**
 * Loads the environment variables from the .env file and validates the required variables.
 * Throws an error if any required environment variable is missing.
 */
function loadEnv() {
  const envPath = path.resolve('.env');
  dotenv.config({ path: envPath });

  // List of required environment variables
  const requiredEnvVars = [
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD',
    // Add more variables here as needed
  ];

  /**
   * Validates that all required environment variables are defined.
   * Throws an error if any variable is missing.
   */
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(`Environment variable ${varName} is not defined.`);
    }
  });
}

// Execute the function to load and validate environment variables
loadEnv();

module.exports = process.env;
