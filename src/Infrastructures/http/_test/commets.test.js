const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestsHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'abc',
      };

      const server = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken({ id: 'user-123' });

      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken({ id: 'user-123' });

      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat menambahkan komentar baru karena properti yang dibutuhkan tidak ada',
      );
    });

    it('should response 400 when request payload not meet data specification', async () => {
      // Arrange
      const requestPayload = {
        content: 123,
      };

      const server = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken({ id: 'user-123' });

      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat menambahkan komentar baru karena tipe data tidak sesuai',
      );
    });

    it('should response 401 when access token not provided', async () => {
      // Arrange
      const requestPayload = {
        content: 'abc',
      };

      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'abc',
      };

      const server = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken({ id: 'user-123' });

      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/threads/xxx/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },

      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and successfully delete comment', async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken({ id: 'user-123' });

      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123' });

      // Act
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 404 when comment is not found', async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken({ id: 'user-123' });

      // Act
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/xxx',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komentar tidak ditemukan');
    });

    it('should response 401 when access token not provided', async () => {
      // Arrange
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 403 Forbidden', async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken({ id: 'user-111' });

      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123' });

      // Act
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat mengakses komentar');
    });
  });
});
