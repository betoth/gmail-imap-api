module.exports = {
  testDir: './tests',  // Define the folder where the tests are located
  timeout: 30000,      // Default timeout of 30 seconds for each test
  retries: 0,          // Number of retries in case of test failure
  reporter: [
    ['list'],                    // Outputs test results in the console in a readable format
    ['html', { outputFolder: 'playwright-report' }]  // Generates an HTML report in the 'playwright-report' folder
  ],
  use: {
    headless: false,   // Runs tests with the browser visible (false for development)
    viewport: { width: 1280, height: 720 },  // Sets the window size
    video: 'on',       // Records videos of the test runs
  },
};
