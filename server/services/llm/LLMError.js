export class LLMError extends Error {
  /**
   * @param {string} message
   * @param {{ provider?: string, model?: string, status?: number, rateLimited?: boolean, tryNextModel?: boolean }} info
   */
  constructor(message, info = {}) {
    super(message);
    this.name = 'LLMError';
    Object.assign(this, info);
  }
}
