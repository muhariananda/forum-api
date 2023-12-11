const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const CreatedReply = require('../../Domains/replies/entities/CreatedReply');
const ReplyDetails = require('../../Domains/replies/entities/ReplyDetails');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(createReply) {
    const { commentId, owner, content } = createReply;
    const id = `reply-${this._idGenerator(16)}`;

    const query = {
      text: `
            INSERT INTO replies VALUES($1, $2, $3, $4)
            RETURNING id, content, owner
        `,
      values: [id, commentId, owner, content],
    };

    const result = await this._pool.query(query);

    return new CreatedReply({ ...result.rows[0] });
  }

  async getRepliesByThreadId(threadId) {
    const query = {
      text: `
        SELECT 
          r.id, 
          r.content, 
          cast(r.date as TEXT),
          u.username, 
          r.comment_id, 
          r.is_deleted
        FROM replies r
        JOIN comments c ON c.id = r.comment_id
        JOIN users u ON u.id = r.owner
        WHERE c.thread_id = $1 
        ORDER BY r.date ASC
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((reply) => new ReplyDetails({
      ...reply,
      commentId: reply.comment_id,
      isDeleted: reply.is_deleted,
    }));
  }

  async deleteReplyById(replyId) {
    const query = {
      text: 'UPDATE replies SET is_deleted = true WHERE id = $1',
      values: [replyId],
    };

    await this._pool.query(query);
  }

  async checkReplyExists(replyId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }
  }

  async verifyReplyOwner({ replyId, userId }) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND owner = $2',
      values: [replyId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('tidak dapat mengakses balasan');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
