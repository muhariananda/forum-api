const CommentDetail = require('../CommentDetail');

describe('DetailComment Class', () => {
  it('should return error when payload not contain needed property', () => {
    // Arrange
    const invalidPayload = {
      id: '123',
      username: 'user',
      content: 'abc',
    };

    // Act & Assert
    expect(() => new CommentDetail(invalidPayload)).toThrowError(
      'DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should return error when payload not meet data type specification', () => {
    // Arrange
    const invalidPayload = {
      id: '123',
      username: 'user',
      date: 2023,
      content: 'abc',
      isDeleted: true,
    };

    // Act & Assert
    expect(() => new CommentDetail(invalidPayload)).toThrowError(
      'DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create DetailComment object correctly', () => {
    // Arrange
    const payload = {
      id: '123',
      username: 'user',
      date: '2023',
      content: 'abc',
      isDeleted: true,
    };

    // Act
    const {
      id, username, date, content, isDeleted,
    } = new CommentDetail(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
    expect(isDeleted).toEqual(payload.isDeleted);
  });
});
