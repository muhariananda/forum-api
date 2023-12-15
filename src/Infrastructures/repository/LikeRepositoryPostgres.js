const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(likeAction) {
    const { commentId, userId } = likeAction;
    const id = `like-${this._idGenerator(16)}`;

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3)',
      values: [id, commentId, userId],
    };

    await this._pool.query(query);
  }

  async getLikesCountByCommentId(commentId) {
    const query = {
      text: 'SELECT * FROM likes WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rowCount;
  }

  async deleteLike(likeAction) {
    const { commentId, userId } = likeAction;

    const query = {
      text: 'DELETE FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, userId],
    };

    await this._pool.query(query);
  }

  async hasCommentLiked(likeAction) {
    const { commentId, userId } = likeAction;

    const query = {
      text: 'SELECT id FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);

    return result.rowCount === 1;
  }
}

module.exports = LikeRepositoryPostgres;
