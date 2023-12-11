const ReplyDetails = require('../ReplyDetails');

describe('ReplyDetails Class', () => {
  it('should return error when payload not contain needed property', () => {
    // Arrange
    const invalidPayload = {
      content: 'abc',
      date: '2023',
      username: 'user',
      commentId: '123',
      isDeleted: false,
    };

    // Act & Assert
    expect(() => new ReplyDetails(invalidPayload)).toThrowError(
      'REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });
  it('should return error when payload not meet data type specification', () => {
    // Arrange
    const invalidPayload = {
      id: 123,
      content: 'abc',
      date: '2023',
      username: 'user',
      commentId: '123',
      isDeleted: false,
    };

    // Act & Assert
    expect(() => new ReplyDetails(invalidPayload)).toThrowError(
      'REPLY_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should return reply details object correctly', () => {
    // Arrange
    const payload = {
      id: '123',
      content: 'abc',
      date: '2023',
      username: 'user',
      commentId: '123',
      isDeleted: false,
    };

    // Act
    const {
      id, content, date, username, commentId, isDeleted,
    } = payload;

    // Act & Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(commentId).toEqual(payload.commentId);
    expect(isDeleted).toEqual(payload.isDeleted);
  });
});
