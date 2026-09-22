async function paginate(model, query, reqQuery = {}, options = {}) {
  const page = parseInt(reqQuery.page, 10) || 1;
  const limit = parseInt(reqQuery.limit, 10) || 6;

  const { populate, sort, ...rest } = options;

  const result = await model.paginate(query, { page, limit, populate, sort, ...rest });

  return {
    data: result.docs,
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
    currentPage: result.page,
    limit: result.limit,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevPage: result.prevPage,
    nextPage: result.nextPage
  };
}

module.exports = paginate;