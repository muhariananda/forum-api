const LikeAction = require('../../Domains/likes/entities/LikeAction');

class AddDeleteLikeUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCaseParams, userId) {
    const { threadId, commentId } = useCaseParams;
    await this._threadRepository.checkThreadExists(threadId);
    await this._commentRepository.checkCommentExists(commentId);

    const likeAction = new LikeAction({ commentId, userId });
    const hasCommentLiked = await this._likeRepository.hasCommentLiked(likeAction);

    if (!hasCommentLiked) {
      await this._likeRepository.addLike(likeAction);
    } else {
      await this._likeRepository.deleteLike(likeAction);
    }
  }
}

module.exports = AddDeleteLikeUseCase;
