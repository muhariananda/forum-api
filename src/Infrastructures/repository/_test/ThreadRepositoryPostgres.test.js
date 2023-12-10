const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

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

  describe('getThreadById', () => {
    it('should return NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Act & Assert
      expect(threadRepositoryPostgres.getThreadById('thread-xxx'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should return detail thread correctly', async () => {
      // Arrange
      const expectedDetailThread = new ThreadDetail({
        id: 'thread-123',
        title: 'abc',
        body: 'abc',
        date: '2023',
        username: 'dummy',
        comments: [],
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'abc',
        body: 'abc',
        owner: 'user-123',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Act
      const detailThread = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(detailThread.id).toEqual(expectedDetailThread.id);
      expect(detailThread.title).toEqual(expectedDetailThread.title);
      expect(detailThread.body).toEqual(expectedDetailThread.body);
      expect(detailThread.username).toEqual(expectedDetailThread.username);
      expect(detailThread.comments).toEqual(expectedDetailThread.comments);
      expect(detailThread.date).toBeDefined();
    });
  });

  describe('checkThreadExists function', () => {
    it('should return NotFoundError when thread is not exists', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Act & Assert
      await expect(threadRepositoryPostgres.checkThreadExists('thread-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not return NotFound error when thread is exists', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, { });

      // Act & Assert
      await expect(threadRepositoryPostgres.checkThreadExists('thread-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });
});
