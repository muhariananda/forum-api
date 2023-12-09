const CreateThread = require('../CreateThread');

describe('CreateThread Class', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      body: 'abc',
      owner: 'user-123',
    };

    // Act & Assert
    expect(() => new CreateThread(payload)).toThrowError(
      'CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 123,
      body: 'abc',
      owner: true,
    };

    // Act & Assert
    expect(() => new CreateThread(payload)).toThrowError(
      'CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create createThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'abc',
      body: 'abc',
      owner: 'user',
    };

    // Act
    const { title, body, owner } = new CreateThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
