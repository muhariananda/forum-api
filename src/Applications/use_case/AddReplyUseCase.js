const CreateReply = require('../../Domains/replies/entities/CreateReply');

class AddReplyUseCase {
  constructor({ commentRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCaseParams, useCasePayload, owner) {
    const { commentId } = useCaseParams;
    await this._commentRepository.checkCommentExists(commentId);

    const createReply = new CreateReply({ commentId, ...useCasePayload, owner });
    return this._replyRepository.addReply(createReply);
  }
}

module.exports = AddReplyUseCase;
