const CreatedReply = require('../CreatedReply');

describe('CreatedReply Class', () => {
  it('should return error when payload not contain needed property', () => {
    // Arrange
    const invalidPayload = {
      content: 'abc',
      owner: 'user',
    };

    // Act & Assert
    expect(() => new CreatedReply(invalidPayload)).toThrowError(
      'CREATED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should return error when payload not meet data type specification', () => {
    // Arrange
    const invalidPayload = {
      id: 123,
      content: 'abc',
      owner: 'user',
    };

    // Act & Assert
    expect(() => new CreatedReply(invalidPayload)).toThrowError(
      'CREATED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should return created reply object correctly', () => {
    // Arrange
    const payload = {
      id: '123',
      content: 'abc',
      owner: 'user',
    };

    // Act
    const { id, content, owner } = new CreatedReply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
