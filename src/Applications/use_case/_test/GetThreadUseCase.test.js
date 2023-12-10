const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const CommentDetail = require('../../../Domains/comments/entities/CommentDetail');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get detail thread action correctly', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
    };

    const mockDetailThread = new ThreadDetail({
      id: 'thread-123',
      title: 'abc',
      body: 'abc',
      date: '2023',
      username: 'user',
      comments: [],
    });

    const mockComments = [
      new CommentDetail({
        id: 'comment-1',
        username: 'user1',
        date: '2023',
        content: 'first content',
        isDeleted: true,
      }),
      new CommentDetail({
        id: 'comment-2',
        username: 'user2',
        date: '2023',
        content: 'second content',
        isDeleted: false,
      }),
    ];

    const expectedThread = {
      id: 'thread-123',
      title: 'abc',
      body: 'abc',
      date: '2023',
      username: 'user',
      comments: [
        {
          id: 'comment-1',
          username: 'user1',
          date: '2023',
          content: '**komentar telah dihapus**',
        },
        {
          id: 'comment-2',
          username: 'user2',
          date: '2023',
          content: 'second content',
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /**
        mocking needed function
    */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComments));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    /**
        spy needed function
    */
    const SpyFormatDeletedComments = jest.spyOn(getThreadUseCase, '_formatDeletedComments');

    // Act
    const thread = await getThreadUseCase.execute(useCaseParams);

    // Assert
    expect(thread).toEqual(expectedThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseParams.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCaseParams.threadId);
    expect(SpyFormatDeletedComments).toHaveBeenCalledWith(mockComments);
  });
});
