const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CreateReply = require('../../../Domains/replies/entities/CreateReply');
const CreatedReply = require('../../../Domains/replies/entities/CreatedReply');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCaseParams = {
      commentId: 'comment-123',
    };
    const useCasePayload = {
      content: 'abc',
    };

    const userId = 'user-123';

    const expectedCreatedReply = new CreatedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: userId,
    });

    const mockCreatedReply = new CreatedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: userId,
    });

    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /**
        mocking needed function
    */
    mockCommentRepository.checkCommentExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockCreatedReply));

    const addReplyUseCase = new AddReplyUseCase({
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Act
    const createdReply = await addReplyUseCase.execute(useCaseParams, useCasePayload, userId);

    // Assert
    expect(createdReply).toStrictEqual(expectedCreatedReply);
    expect(mockCommentRepository.checkCommentExists).toBeCalledWith('comment-123');
    expect(mockReplyRepository.addReply).toBeCalledWith(new CreateReply({
      ...useCaseParams,
      ...useCasePayload,
      owner: userId,
    }));
  });
});
