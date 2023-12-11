const CreateReply = require('../CreateReply');

describe('CreateReply Class', () => {
  it('should return error when payload not contain needed property', () => {
    // Arrange
    const invalidPayload = {
      owner: 'user',
      content: 'abc',
    };

    // Act & Assert
    expect(() => new CreateReply(invalidPayload)).toThrowError(
      'CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should return error when payload not meet data type specification', () => {
    // Arrange
    const invalidPayload = {
      commentId: 123,
      owner: 'user',
      content: 'abc',
    };

    // Act & Assert
    expect(() => new CreateReply(invalidPayload)).toThrowError(
      'CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should return create reply object correctly', () => {
    // Arrange
    const payload = {
      commentId: '123',
      owner: 'user',
      content: 'abc',
    };

    // Act
    const { commentId, owner, content } = new CreateReply(payload);

    // Assert
    expect(commentId).toEqual(payload.commentId);
    expect(owner).toEqual(payload.owner);
    expect(content).toEqual(payload.content);
  });
});
