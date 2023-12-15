const CommentRepository = require('../../Domains/comments/CommentRepository');
const CreatedComment = require('../../Domains/comments/entities/CreatedComment');
const CommentDetail = require('../../Domains/comments/entities/CommentDetail');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(createComment) {
    const { threadId, content, owner } = createComment;
    const id = `comment-${this._idGenerator(16)}`;

    const query = {
      text: `
         INSERT INTO comments VALUES($1, $2, $3, $4)
         RETURNING id, content, owner
        `,
      values: [id, content, owner, threadId],
    };

    const result = await this._pool.query(query);

    return new CreatedComment({ ...result.rows[0] });
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `
        SELECT c.id, u.username, cast(c.date as TEXT), c.content, c.is_delete
        FROM comments c JOIN users u ON u.id = c.owner
        WHERE c.thread_id = $1 ORDER BY c.date ASC
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((row) => new CommentDetail({
      ...row,
      isDeleted: row.is_delete,
      replies: [],
      likeCount: 0,
    }));
  }

  async deleteCommentById(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [commentId],
    };

    await this._pool.query(query);
  }

  async checkCommentExists(commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }

  async verifyCommentOwner({ commentId, userId }) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('tidak dapat mengakses komentar');
    }
  }
}

module.exports = CommentRepositoryPostgres;
