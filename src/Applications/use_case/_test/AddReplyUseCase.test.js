const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CreateReply = require('../../../Domains/replies/entities/CreateReply');
const CreatedReply = require('../../../Domains/replies/entities/CreatedReply');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
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

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /**
        mocking needed function
    */
    mockThreadRepository.checkThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkCommentExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockCreatedReply));

    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Act
    const createdReply = await addReplyUseCase.execute(useCaseParams, useCasePayload, userId);

    // Assert
    expect(createdReply).toStrictEqual(expectedCreatedReply);
    expect(mockThreadRepository.checkThreadExists).toBeCalledWith('thread-123');
    expect(mockCommentRepository.checkCommentExists).toBeCalledWith('comment-123');
    expect(mockReplyRepository.addReply).toBeCalledWith(new CreateReply({
      ...useCaseParams,
      ...useCasePayload,
      owner: userId,
    }));
  });
});
