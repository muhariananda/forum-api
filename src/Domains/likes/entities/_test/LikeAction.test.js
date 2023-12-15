const LikeAction = require('../LikeAction');

describe('LikeAction Class', () => {
  it('should return error when payload not contain needed property', () => {
    // Arrange
    const invalidPayload = {
      userId: 'user',
    };

    // Act & Assert
    expect(() => new LikeAction(invalidPayload)).toThrowError(
      'LIKE_ACTION.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should return error when payload not meet data type specification', () => {
    // Arrange
    const invalidPayload = {
      commentId: 123,
      userId: 'user',
    };

    // Act & Assert
    expect(() => new LikeAction(invalidPayload)).toThrowError(
      'LIKE_ACTION.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should return like action object correctly', () => {
    // Arrange
    const payload = {
      commentId: '123',
      userId: 'user',
    };

    // Act
    const { commentId, userId } = new LikeAction(payload);

    // Act & Assert
    expect(commentId).toEqual(commentId);
    expect(userId).toEqual(userId);
  });
});
