class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCaseParams) {
    const { threadId } = useCaseParams;

    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    const formattedComments = this._formatDeletedComments(comments);
    thread.comments = formattedComments;

    return thread;
  }

  _formatDeletedComments(comments) {
    return comments.map(({ isDeleted, content, ...rest }) => ({
      ...rest,
      content: isDeleted ? '**komentar telah dihapus**' : content,
    }));
  }
}

module.exports = GetThreadUseCase;
