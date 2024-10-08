const path = require('path');
const dotenv = require('dotenv');

/**
 * Loads the .env file and validates required environment variables for the application.
 * This function ensures that all necessary environment variables are properly set up.
 */
function loadEnvironmentVariables() {
  const envPath = path.resolve('.env');
  dotenv.config({ path: envPath });

  // List of required environment variables for email infrastructure
  const requiredEnvVars = [
    'IMAP_HOST',
    'IMAP_PORT',
    'IMAP_TLS',
    // Add any other required variables in the future to this list.
  ];

  // Validate each required environment variable to ensure it is set
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(`Environment variable ${varName} is not defined.`);
    }
  });
}

// Load and validate environment variables when this module is imported
loadEnvironmentVariables();

module.exports = process.env;
