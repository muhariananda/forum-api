const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const CreateReply = require('../../../Domains/replies/entities/CreateReply');
const CreatedReply = require('../../../Domains/replies/entities/CreatedReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123' });
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('addReply function', () => {
    it('should persist create reply correctly', async () => {
      // Arrange
      const createReply = new CreateReply({
        commentId: 'comment-123',
        owner: 'user-123',
        content: 'abc',
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Act
      await replyRepositoryPostgres.addReply(createReply);

      // Assert
      const replies = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(replies).toHaveLength(1);
    });

    it('should return created reply correctly', async () => {
      // Arrange
      const createReply = new CreateReply({
        commentId: 'comment-123',
        owner: 'user-123',
        content: 'abc',
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Act
      const createdReply = await replyRepositoryPostgres.addReply(createReply);
      expect(createdReply).toStrictEqual(new CreatedReply({
        id: 'reply-123',
        content: 'abc',
        owner: 'user-123',
      }));
    });
  });

  describe('deleteReplyById function', () => {
    it('should delete reply correctly', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({ id: 'reply-123' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Act
      await replyRepositoryPostgres.deleteReplyById('reply-123');

      // Assert
      const replies = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(replies[0].is_deleted).toEqual(true);
    });
  });

  describe('checkReplyExists function', () => {
    it('should return NotFoundError when reply not exists', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Act & Assert
      await expect(replyRepositoryPostgres.checkReplyExists('reply-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not return NotFoundError when reply exists', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({ id: 'reply-123' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Act & Assert
      await expect(replyRepositoryPostgres.checkReplyExists('reply-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should return AuthorizationError when owner not verify', async () => {
      // Arrange
      const params = {
        replyId: 'reply-123',
        userId: 'user-123',
      };

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Act & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner(params))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not return AuthorizationError when owner is verify', async () => {
      // Arrange
      const params = {
        replyId: 'reply-123',
        userId: 'user-123',
      };

      await RepliesTableTestHelper.addReply({ id: 'reply-123', owner: 'user-123' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Act & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner(params))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });
});
