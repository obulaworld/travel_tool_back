class Pagination {
  static initializePagination(req) {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const offset = limit * (page - 1);
    const paginationInit = {
      page,
      limit,
      offset,
    };
    return paginationInit;
  }

  static getPaginationData(page, limit, { count, rows }) {
    let pagination;
    if (rows.length) {
      const pageCount = Math.ceil(count / limit);
      pagination = {
        pageCount,
        currentPage: +page,
        dataCount: count,
      };
    }
    return pagination;
  }
}

export default Pagination;
