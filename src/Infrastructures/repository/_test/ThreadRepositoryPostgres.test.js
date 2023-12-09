const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

const pool = require('../../database/postgres/pool');

const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');

describe('ThreadRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dummy' });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    pool.end();
  });

  describe('addThread function', () => {
    it('should persist crate thread', async () => {
      // Arrange
      const createThread = new CreateThread({
        title: 'abc',
        body: 'abc',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Act
      await threadRepositoryPostgres.addThread(createThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should crated thread correctly', async () => {
      // Arrange
      const createThread = new CreateThread({
        title: 'abc',
        body: 'abc',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Act
      const createdThread = await threadRepositoryPostgres.addThread(createThread);

      // Assert
      expect(createdThread).toStrictEqual(new CreatedThread({
        id: 'thread-123',
        title: createThread.title,
        owner: createThread.owner,
      }));
    });
  });
});
