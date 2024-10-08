const GetEmailService = require('../interactions/getEmailService');

/**
 * DeleteEmailById is a task that deletes a specific email by its ID.
 * It utilizes the email service to perform the deletion.
 */
class DeleteEmailById {
  /**
   * Creates an instance of the DeleteEmailById task.
   * @param {string} emailId - The unique identifier of the email to be deleted.
   * @returns {Function} A function that accepts an actor and performs the task of deleting the specified email.
   */
  static perform(emailId) {
    return async (actor) => {
      const emailService = await GetEmailService.perform()(actor); // Using the interaction to get the emailService
      await emailService.deleteEmail(emailId); // Directly calling the deleteEmail method from the email service
    };
  }
}

module.exports = DeleteEmailById;
