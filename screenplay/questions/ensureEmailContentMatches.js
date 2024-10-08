/**
 * EnsureEmailContentMatches is a question that verifies if the content of a specific email matches the expected content.
 * This question is used in the Screenplay Pattern to confirm the email's content.
 */
class EnsureEmailContentMatches {
  /**
   * Initializes a new instance of the EnsureEmailContentMatches question.
   * @param {Object} email - The email object to check.
   * @param {string} expectedContent - The expected content of the email.
   */
  constructor(email, expectedContent) {
    this.email = email;
    this.expectedContent = expectedContent;
  }

  /**
   * Static method to create an instance of EnsureEmailContentMatches.
   * @param {Object} email - The email object to check.
   * @param {string} expectedContent - The expected content of the email.
   * @returns {EnsureEmailContentMatches} An instance of the EnsureEmailContentMatches question.
   */
  static perform(email, expectedContent) {
    return new EnsureEmailContentMatches(email, expectedContent);
  }

  /**
   * Verifies if the content of the email matches the expected content.
   * @returns {boolean} True if the content matches, otherwise false.
   */
  answeredBy() {
    // Check if the email's content matches the expected content
    return this.email.content === this.expectedContent;
  }
}

module.exports = EnsureEmailContentMatches;
