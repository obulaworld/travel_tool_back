import paginationHelper from '../../helpers/Pagination';

class UserRoleUtils {
  static getPaginatedRoles(req, count, roles) {
    const {
      id,
      roleName,
      description,
      createdAt,
      updatedAt,
      users
    } = roles;

    const {
      currentPage,
      pageCount,
      initialPage
    } = paginationHelper.getPaginationParams(req, count);
    const pagintedUsersRole = users
      .slice(initialPage.offset, (Number.parseInt(initialPage.limit, 10) + initialPage.offset));
    const paginationData = {
      currentPage,
      pageCount,
      pagintedUsersRole,
    };

    const roleData = {
      id,
      roleName,
      description,
      createdAt,
      updatedAt,
    };
    return {
      roleData,
      paginationData
    };
  }
}

export default UserRoleUtils;
