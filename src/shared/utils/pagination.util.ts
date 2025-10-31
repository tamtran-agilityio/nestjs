/**
 * Builds pagination options for a database query.
 * @param page The page number (zero-based).
 * @param limit The number of items per page.
 * @returns An object containing the skip and take values for pagination.
 */
export function buildPaginationOptions(page = 0, limit = 10) {
  return {
    skip: page * limit,
    take: limit,
  };
}
