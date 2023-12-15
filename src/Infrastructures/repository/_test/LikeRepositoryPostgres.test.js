const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const LikeAction = require('../../../Domains/likes/entities/LikeAction');
const pool = require('../../database/postgres/pool');

describe('LikeRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123' });
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('addLike function', () => {
    it('should persist comment like', async () => {
      // Arrange
      const likeAction = new LikeAction({
        commentId: 'comment-123',
        userId: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Act
      await likeRepositoryPostgres.addLike(likeAction);

      // Assert
      const likes = await LikesTableTestHelper.findLikeByCommentIdAndUserId({
        commentId: likeAction.commentId,
        userId: likeAction.userId,
      });
      expect(likes).toHaveLength(1);
    });
  });

  describe('getLikesByCommentId function', () => {
    it('should return likes count of comment correctly', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      await LikesTableTestHelper.addLike({ commentId: 'comment-123', userId: 'user-1' });
      await LikesTableTestHelper.addLike({ commentId: 'comment-123', userId: 'user-2' });

      // Act
      const likesCount = await likeRepositoryPostgres.getLikesCountByCommentId('comment-123');

      // Assert
      expect(likesCount).toEqual(2);
    });
  });

  describe('deleteLike function', () => {
    it('should delete like of comment correctly', async () => {
      // Arrange
      const likeAction = new LikeAction({
        commentId: 'comment-123',
        userId: 'user-123',
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      await LikesTableTestHelper.addLike({ commentId: 'comment-123', userId: 'user-123' });

      // Act
      await likeRepositoryPostgres.deleteLike(likeAction);

      // Assert
      const likes = await LikesTableTestHelper.findLikeByCommentIdAndUserId({
        commentId: likeAction.commentId,
        userId: likeAction.userId,
      });
      expect(likes).toHaveLength(0);
    });
  });

  describe('hasCommentLiked function', () => {
    it('should return false when like does not exists', async () => {
      // Arrange
      const likeAction = new LikeAction({
        commentId: 'comment-123',
        userId: 'user-123',
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Act
      const isLiked = await likeRepositoryPostgres.hasCommentLiked(likeAction);

      // Assert
      expect(isLiked).toEqual(false);
    });

    it('should return true when like exists', async () => {
      // Arrange
      const likeAction = new LikeAction({
        commentId: 'comment-123',
        userId: 'user-123',
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      await LikesTableTestHelper.addLike({ commentId: 'comment-123', userId: 'user-123' });

      // Act
      const isLiked = await likeRepositoryPostgres.hasCommentLiked(likeAction);

      // Assert
      expect(isLiked).toEqual(true);
    });
  });
});
