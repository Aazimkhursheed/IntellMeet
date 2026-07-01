/**
 * Async handler wrapper to eliminate try/catch blocks in controllers
 * @param {Function} fn - Async controller function
 * @returns {Function} Express route handler
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};