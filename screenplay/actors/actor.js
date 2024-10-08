/**
 * Represents an actor in the Screenplay Pattern who can perform tasks and ask questions using their abilities.
 */
class Actor {
  /**
   * Creates a new actor with a given name.
   * @param {string} name - The name of the actor.
   */
  constructor(name) {
    this.name = name;
    this.abilities = [];
  }

  /**
   * Assigns abilities to the actor, enabling them to perform specific tasks.
   * @param {...Object} abilities - The abilities the actor can use.
   * @returns {Actor} The actor instance with updated abilities.
   */
  whoCan(...abilities) {
    this.abilities.push(...abilities);
    return this;
  }

  /**
   * Retrieves a specific ability from the actor.
   * @param {Object} abilityClass - The ability class to retrieve.
   * @returns {Object} The instance of the specified ability.
   * @throws {Error} If the actor does not have the required ability.
   */
  abilityTo(abilityClass) {
    const ability = this.abilities.find(ability => ability.constructor.name === abilityClass.name);
    if (!ability) {
      throw new Error(`Actor ${this.name} does not have the ability to ${abilityClass.name}`);
    }
    return ability;
  }

  /**
   * Makes the actor attempt to perform one or more tasks.
   * @param {...Function} tasks - The tasks for the actor to perform.
   * @returns {Promise} A promise that resolves when all tasks are completed.
   */
  async attemptsTo(...tasks) {
    for (const task of tasks) {
      await task(this);
    }
  }

  /**
   * Asks a question, using the actor's abilities to get an answer.
   * @param {Object} question - The question object to be answered.
   * @returns {Promise<any>} The answer to the question.
   */
  asks(question) {
    return question.answeredBy(this);
  }
}

module.exports = { Actor };
