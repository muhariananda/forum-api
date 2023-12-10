const CommentRepository = require('../../Domains/comments/CommentRepository');
const CreatedComment = require('../../Domains/comments/entities/CreatedComment');

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
}

module.exports = CommentRepositoryPostgres;
