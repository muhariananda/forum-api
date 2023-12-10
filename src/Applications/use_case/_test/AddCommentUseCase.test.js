const AddCommentUseCase = require('../AddCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
    };
    const useCasePayload = {
      content: 'abc',
    };

    const userId = 'user-123';

    const expectedCreatedComment = new CreatedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: userId,
    });

    const mockCreatedComment = new CreatedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: userId,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /**
        mocking needed function
    */
    mockThreadRepository.checkThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockCreatedComment));

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const createdComment = await addCommentUseCase.execute(useCaseParams, useCasePayload, userId);

    // Assert
    expect(createdComment).toStrictEqual(expectedCreatedComment);
    expect(mockThreadRepository.checkThreadExists).toBeCalledWith('thread-123');
    expect(mockCommentRepository.addComment).toBeCalledWith(new CreateComment({
      ...useCaseParams,
      ...useCasePayload,
      owner: userId,
    }));
  });
});
