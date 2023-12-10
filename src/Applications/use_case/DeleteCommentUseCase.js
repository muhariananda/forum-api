class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCaseParams, userId) {
    const { commentId } = useCaseParams;

    await this._commentRepository.checkCommentExists(commentId);
    await this._commentRepository.verifyCommentOwner({ commentId, userId });
    await this._commentRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentUseCase;
