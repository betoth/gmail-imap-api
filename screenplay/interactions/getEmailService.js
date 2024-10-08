const ManageEmails = require('../abilities/manageEmails');

/**
 * Interaction class to retrieve the email service used by the actor.
 * This interaction allows the actor to access the email-related abilities defined in the test scenarios.
 */
class GetEmailService {
  /**
   * Creates an interaction to retrieve the email service.
   * This method returns an asynchronous function that requires an actor as a parameter.
   * @returns {Function} An asynchronous function that retrieves the email service for the actor.
   */
  static perform() {
    return async (actor) => {
      // Retrieve the actor's ability to manage emails using the ManageEmails class
      const manageEmails = actor.abilityTo(ManageEmails);
      
      // Return the email service associated with the ManageEmails ability
      return manageEmails.getEmailService();
    };
  }
}

module.exports = GetEmailService;
