const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const CreatedReply = require('../../Domains/replies/entities/CreatedReply');

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
}

module.exports = ReplyRepositoryPostgres;
