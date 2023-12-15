const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const CommentDetail = require('../../../Domains/comments/entities/CommentDetail');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dummy' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('addComment function', () => {
    it('should persist create comment and return created comment correctly', async () => {
      // Arrange
      const createComment = new CreateComment({
        threadId: 'thread-123',
        owner: 'user-123',
        content: 'abc',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Act
      await commentRepositoryPostgres.addComment(createComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return created comment correctly', async () => {
      // Arrange
      const createComment = new CreateComment({
        threadId: 'thread-123',
        owner: 'user-123',
        content: 'abc',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Act
      const createdComment = await commentRepositoryPostgres.addComment(createComment);

      // Assert
      expect(createdComment).toStrictEqual(new CreatedComment({
        id: 'comment-123',
        content: 'abc',
        owner: 'user-123',
      }));
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return accurate comment detail for all thread comments', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-1' });
      await CommentsTableTestHelper.addComment({ id: 'comment-2' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Act
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      // Assert
      expect(comments).toHaveLength(2);

      expect(comments[0].date).toBeDefined();
      expect(comments[0]).toStrictEqual(new CommentDetail({
        id: 'comment-1',
        username: 'dummy',
        date: comments[0].date,
        content: 'abc',
        isDeleted: false,
        replies: [],
        likeCount: 0,
      }));

      expect(comments[1].date).toBeDefined();
      expect(comments[1]).toStrictEqual(new CommentDetail({
        id: 'comment-2',
        username: 'dummy',
        date: comments[1].date,
        content: 'abc',
        isDeleted: false,
        replies: [],
        likeCount: 0,
      }));
    });
  });

  describe('deleteCommentById function', () => {
    it('should delete comment correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Act
      await commentRepositoryPostgres.deleteCommentById('comment-123');

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments[0].is_delete).toEqual(true);
    });
  });

  describe('checkCommentExists function', () => {
    it('should return NotFoundError when comment not exists', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Act & Assert
      await expect(commentRepositoryPostgres.checkCommentExists('comment-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not return NotFoundError when comment exists', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Act & Assert
      await expect(commentRepositoryPostgres.checkCommentExists('comment-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should return AuthorizationError when comment owner not verify', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Act & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner({
        commentId: 'comment-123', userId: 'user-111',
      })).rejects.toThrowError(AuthorizationError);
    });

    it('should not return AuthorizationError when comment verify', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Act & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner({
        commentId: 'comment-123', userId: 'user-123',
      })).resolves.not.toThrowError(AuthorizationError);
    });
  });
});
