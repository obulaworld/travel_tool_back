import models from '../../database/models';
import Utils from '../../helpers/Utils';
import handleServerError from '../../helpers/serverError';
import notFoundError from '../../helpers/notFoundError';

class CommentsController {
  static async createComment(req, res) {
    try {
      const { requestId } = req.body;
      const { name, email, picture } = req.user.UserInfo;
      const commentData = {
        ...req.body,
        id: Utils.generateUniqueId(),
        userName: name,
        userEmail: email,
        picture,
      };
      const request = await models.Request.findById(requestId);
      // only create a comment if the request exists
      if (request) {
        const newComment = await models.Comment.create(commentData);
        return res.status(201).json({
          success: true,
          message: 'Comment created successfully',
          comment: newComment,
        });
      }
      return notFoundError('Request does not exist', res);
    } catch (error) { /* istanbul ignore next */
      return handleServerError('Server Error', res);
    }
  }

  static async editComment(req, res) {
    try {
      const { requestId } = req.body;
      const commentId = req.params.id;
      const { name, email, picture } = req.user.UserInfo;
      const commentData = {
        ...req.body, userName: name, userEmail: email, picture, isEdited: true
      };
      const request = await models.Request.findById(requestId);
      if (!request) {
        return notFoundError('Request does not exist', res);
      }
      const foundComment = await models.Comment.findById(commentId);
      if (!foundComment) {
        return notFoundError('Comment does not exist', res);
      }
      const editedComment = await models.Comment.update(commentData,
        { where: { id: commentId }, returning: true, plain: true });
      return res.status(200).json({
        success: true,
        message: 'Comment updated successfully',
        comment: editedComment[1],
      });
    } catch (error) { /* istanbul ignore next */
      return handleServerError('Server Error', res);
    }
  }
}

export default CommentsController;
