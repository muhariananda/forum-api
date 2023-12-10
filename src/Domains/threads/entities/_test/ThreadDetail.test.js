const ThreadDetail = require('../ThreadDetail');

describe('ThreadDetail Class', () => {
  it('should throw error with invalid payload', () => {
    // Arrange
    const invalidPayload = {
      id: '123',
      title: 'abc',
      body: 'abc',
      username: 'user',
      comments: [],
    };

    // Act & Assert
    expect(() => new ThreadDetail(invalidPayload)).toThrowError(
      'DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not meet data specification', () => {
    // Arrange
    const invalidPayload = {
      id: '123',
      title: 'abc',
      body: 'abc',
      date: '2023',
      username: 'user',
      comments: 'not-array',
    };

    // Act & Assert
    expect(() => new ThreadDetail(invalidPayload)).toThrowError(
      'DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create DetailThread object correctly', () => {
    // Arrange
    const payload = {
      id: '123',
      title: 'abc',
      body: 'abc',
      date: '2023',
      username: 'user',
      comments: [],
    };

    // Act
    const {
      id, title, body, date, username, comments,
    } = new ThreadDetail(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(comments).toEqual(payload.comments);
  });
});
