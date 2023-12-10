const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const CreatedThread = require('../../Domains/threads/entities/CreatedThread');
const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(createThread) {
    const { title, body, owner } = createThread;
    const id = `thread-${this._idGenerator(16)}`;

    const query = {
      text: `
        INSERT INTO threads 
        VALUES($1, $2, $3, $4)
        RETURNING id, title, owner`,
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);

    return new CreatedThread({ ...result.rows[0] });
  }

  async getThreadById(threadId) {
    const query = {
      text: `
        SELECT t.id, t.title, t.body, cast(t.date as TEXT), u.username
        FROM threads t JOIN users u ON u.id = t.owner
        WHERE t.id = $1
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return new ThreadDetail({ ...result.rows[0], comments: [] });
  }

  async checkThreadExists(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
