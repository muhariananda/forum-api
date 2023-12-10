const CreateComment = require('../../Domains/comments/entities/CreateComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCaseParams, useCasePayload, owner) {
    const { threadId } = useCaseParams;
    await this._threadRepository.checkThreadExists(threadId);

    const createComment = new CreateComment({ ...useCasePayload, threadId, owner });
    return this._commentRepository.addComment(createComment);
  }
}

module.exports = AddCommentUseCase;
