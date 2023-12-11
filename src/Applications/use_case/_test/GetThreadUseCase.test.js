const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const CommentDetail = require('../../../Domains/comments/entities/CommentDetail');
const ReplyDetails = require('../../../Domains/replies/entities/ReplyDetails');

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
        replies: [],
      }),
      new CommentDetail({
        id: 'comment-2',
        username: 'user2',
        date: '2023',
        content: 'second content',
        isDeleted: false,
        replies: [],
      }),
    ];

    const mockReplies = [
      new ReplyDetails({
        id: 'reply-1',
        content: 'first reply',
        date: '2023',
        username: 'user1',
        commentId: 'comment-1',
        isDeleted: false,
      }),
      new ReplyDetails({
        id: 'reply-2',
        content: 'second reply',
        date: '2023',
        username: 'user2',
        commentId: 'comment-2',
        isDeleted: true,
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
          replies: [
            {
              id: 'reply-1',
              content: 'first reply',
              date: '2023',
              username: 'user1',
            },
          ],
        },
        {
          id: 'comment-2',
          username: 'user2',
          date: '2023',
          content: 'second content',
          replies: [
            {
              id: 'reply-2',
              content: '**balasan telah dihapus**',
              date: '2023',
              username: 'user2',
            },
          ],
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /**
        mocking needed function
    */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComments));
    mockReplyRepository.getRepliesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReplies));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    /**
        spy needed function
    */
    const SpyFormatDeletedComments = jest.spyOn(getThreadUseCase, '_formatDeletedComments');
    const SpyFormatDeletedReplies = jest.spyOn(getThreadUseCase, '_formatDeletedReplies');
    const SpyPutRepliesToComments = jest.spyOn(getThreadUseCase, '_putRepliesToComments');

    // Act
    const thread = await getThreadUseCase.execute(useCaseParams);

    // Assert
    expect(thread).toEqual(expectedThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseParams.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCaseParams.threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(useCaseParams.threadId);
    expect(SpyFormatDeletedComments).toHaveBeenCalledWith(mockComments);
    expect(SpyFormatDeletedReplies).toHaveBeenCalledWith(mockReplies);
    expect(SpyPutRepliesToComments).toHaveBeenCalled();
  });
});
