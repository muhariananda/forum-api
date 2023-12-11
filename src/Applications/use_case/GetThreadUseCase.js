class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCaseParams) {
    const { threadId } = useCaseParams;

    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const replies = await this._replyRepository.getRepliesByThreadId(threadId);

    const formattedComments = this._formatDeletedComments(comments);
    const formattedReplies = this._formatDeletedReplies(replies);
    const commentsWithReplies = this._putRepliesToComments(formattedComments, formattedReplies);

    thread.comments = commentsWithReplies;
    return thread;
  }

  _formatDeletedComments(comments) {
    return comments.map(({ isDeleted, content, ...rest }) => ({
      ...rest,
      content: isDeleted ? '**komentar telah dihapus**' : content,
    }));
  }

  _formatDeletedReplies(replies) {
    return replies.map(({ isDeleted, content, ...rest }) => ({
      ...rest,
      content: isDeleted ? '**balasan telah dihapus**' : content,
    }));
  }

  _putRepliesToComments(comments, replies) {
    return comments.map((comment) => ({
      ...comment,
      replies: replies
        .filter((reply) => reply.commentId === comment.id)
        .map(({ commentId, ...cleanedReply }) => cleanedReply),
    }));
  }
}

module.exports = GetThreadUseCase;
