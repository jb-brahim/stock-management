/**
 * Extracts and sanitizes pagination options from query parameters
 */
const getPaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const requestedLimit = parseInt(query.limit, 10) || 20;
  const limit = Math.min(100, Math.max(1, requestedLimit));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Formats pagination object for API output
 */
const formatPagination = (page, limit, total) => {
  const pages = Math.ceil(total / limit) || 1;
  return {
    page,
    limit,
    total,
    pages,
  };
};

module.exports = {
  getPaginationParams,
  formatPagination,
};
