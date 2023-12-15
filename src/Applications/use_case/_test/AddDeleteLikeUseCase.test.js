const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const AddDeleteLikeUseCase = require('../AddDeleteLikeUseCase');

describe('AddDeleteLikeUseCase', () => {
  it('should orchestrating the add like action when like does not exists', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const userId = 'user-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /**
        mocking needed function
    */
    mockThreadRepository.checkThreadExists = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkCommentExists = jest.fn(() => Promise.resolve());
    mockLikeRepository.hasCommentLiked = jest.fn(() => Promise.resolve(false));
    mockLikeRepository.addLike = jest.fn(() => Promise.resolve());

    const addDeleteLikeUseCase = new AddDeleteLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Act
    await addDeleteLikeUseCase.execute(useCaseParams, userId);

    // Assert
    expect(mockThreadRepository.checkThreadExists).toBeCalledWith(useCaseParams.threadId);
    expect(mockCommentRepository.checkCommentExists).toBeCalledWith(useCaseParams.commentId);
    expect(mockLikeRepository.hasCommentLiked).toBeCalledWith({
      commentId: useCaseParams.commentId, userId,
    });
    expect(mockLikeRepository.addLike).toBeCalledWith({
      commentId: useCaseParams.commentId, userId,
    });
  });

  it('should orchestrating the delete like action when like exists', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const userId = 'user-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /**
        mocking needed function
    */
    mockThreadRepository.checkThreadExists = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkCommentExists = jest.fn(() => Promise.resolve());
    mockLikeRepository.hasCommentLiked = jest.fn(() => Promise.resolve(true));
    mockLikeRepository.deleteLike = jest.fn(() => Promise.resolve());

    const addDeleteLikeUseCase = new AddDeleteLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Act
    await addDeleteLikeUseCase.execute(useCaseParams, userId);

    // Assert
    expect(mockThreadRepository.checkThreadExists).toBeCalledWith(useCaseParams.threadId);
    expect(mockCommentRepository.checkCommentExists).toBeCalledWith(useCaseParams.commentId);
    expect(mockLikeRepository.hasCommentLiked).toBeCalledWith({
      commentId: useCaseParams.commentId, userId,
    });
    expect(mockLikeRepository.deleteLike).toBeCalledWith({
      commentId: useCaseParams.commentId, userId,
    });
  });
});
