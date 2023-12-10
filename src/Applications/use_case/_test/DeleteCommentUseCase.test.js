const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const useCaseParams = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const mockCommentRepository = new CommentRepository();

    /**
        mocking needed function
    */
    mockCommentRepository.checkCommentExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCaseParams, userId);

    // Assert
    expect(mockCommentRepository.checkCommentExists)
      .toBeCalledWith(useCaseParams.commentId);
    expect(mockCommentRepository.verifyCommentOwner)
      .toBeCalledWith({ commentId: 'comment-123', userId });
    expect(mockCommentRepository.deleteCommentById)
      .toBeCalledWith('comment-123');
  });
});
