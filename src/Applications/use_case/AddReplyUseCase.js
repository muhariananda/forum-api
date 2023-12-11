const CreateReply = require('../../Domains/replies/entities/CreateReply');

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCaseParams, useCasePayload, owner) {
    const { threadId, commentId } = useCaseParams;
    await this._threadRepository.checkThreadExists(threadId);
    await this._commentRepository.checkCommentExists(commentId);

    const createReply = new CreateReply({ commentId, ...useCasePayload, owner });
    return this._replyRepository.addReply(createReply);
  }
}

module.exports = AddReplyUseCase;
