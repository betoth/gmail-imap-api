const { test, expect } = require('@playwright/test');
const { Actor } = require('../screenplay/actors/actor');
const ManageEmails = require('../screenplay/abilities/manageEmails');
const ClearInbox = require('../screenplay/tasks/clearInbox');
const SendEmail = require('../screenplay/tasks/sendEmail');
const DeleteEmailById = require('../screenplay/tasks/deleteEmailById');
const DoesEmailExist = require('../screenplay/questions/doesEmailExist');
const EnsureEmailContentMatches = require('../screenplay/questions/ensureEmailContentMatches');
const IsEmailDeleted = require('../screenplay/questions/isEmailDeleted');
const { Users } = require('../screenplay/data/users');

/**
 * Integration test suite for email management using the Screenplay pattern.
 */
test.describe('Email Management Integration Test', () => {
  let admin;

  /**
   * Setup before all tests: Configures the actor with email capabilities and clears the inbox.
   */
  test.beforeAll(async () => {
    console.log('STEP 1: Configuring the actor with email capabilities and clearing the inbox.');

    // Configuring the actor "Admin" with the ability to manage emails
    admin = new Actor('Admin').whoCan(
      ManageEmails.usingCredentials(Users.admin.email, Users.admin.password)
    );

    // Clearing the inbox before starting the tests
    console.log('STEP 2: Clearing the inbox before running tests.');
    await admin.attemptsTo(ClearInbox.perform());

    // Sending a test email to the admin email
    console.log('STEP 3: Sending a test email to the Admin email address.');
    await admin.attemptsTo(SendEmail.perform(
      Users.admin.email,
      'Test Subject',
      'This is a test email body.'
    ));
  });

  /**
   * Test case: Should send, find, verify content, and delete an email in an integrated flow.
   */
  test('should send, find, verify content, and delete an email in an integrated flow', async () => {
    console.log('STEP 4: Starting the integrated email management test.');

    // Step 1: Verifying if the email exists with the specified subject and sender
    console.log('STEP 5: Checking if the email with the specified subject and sender exists.');
    const emailToFind = await admin.asks(DoesEmailExist.perform(Users.admin.email, 'Test Subject'));

    // Validating that the email was found successfully
    console.log('STEP 6: Validating that the email was found.');
    expect(emailToFind).toBeDefined();
    expect(emailToFind).not.toBeNull();
    expect(emailToFind.uid).toBeDefined();

    // Step 2: Ensuring that the email content matches the expected value
    console.log('STEP 7: Verifying that the content of the found email matches the expected content.');
    const isContentCorrect = await admin.asks(EnsureEmailContentMatches.perform(emailToFind, 'This is a test email body.'));
    expect(isContentCorrect).toBe(true);

    // Step 3: Deleting the found email
    console.log(`STEP 8: Deleting the email with UID: ${emailToFind.uid}`);
    await admin.attemptsTo(DeleteEmailById.perform(emailToFind.uid));

    // Step 4: Verifying that the email was successfully deleted
    console.log(`STEP 9: Confirming the deletion of the email with UID: ${emailToFind.uid}`);
    const isEmailDeleted = await admin.asks(IsEmailDeleted.perform(emailToFind.uid));
    expect(isEmailDeleted).toBe(true); // Confirming the email deletion

    console.log('STEP 10: Email management test completed successfully.');
  });
});
