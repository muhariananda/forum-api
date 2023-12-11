const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const useCaseParams = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
    };

    const mockReplyRepository = new ReplyRepository();

    /**
        mocking needed function
    */
    mockReplyRepository.checkReplyExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Act
    await deleteReplyUseCase.execute(useCaseParams, userId);

    // Assert
    expect(mockReplyRepository.checkReplyExists).toBeCalledWith(useCaseParams.replyId);
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith({
      replyId: useCaseParams.replyId, userId,
    });
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(useCaseParams.replyId);
  });
});
