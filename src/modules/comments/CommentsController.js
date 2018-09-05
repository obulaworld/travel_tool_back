import models from '../../database/models';

class CommentsController {
  static async createComment(req, res) {
    try {
      const { requestId } = req.body;
      const { name, email, picture } = req.user.UserInfo;
      const commentData = {
        ...req.body, userName: name, userEmail: email, picture,
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
      return res.status(404).json({
        success: false,
        error: 'Request does not exist',
      });
    } catch (error) { /* istanbul ignore next */
      return res.json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
}

export default CommentsController;
