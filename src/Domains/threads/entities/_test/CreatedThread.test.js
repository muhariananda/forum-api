const CreatedThread = require('../CreatedThread');

describe('CreatedThread Class', () => {
  it('should throw error when payload did not contain needed property ', () => {
    // Arrange
    const payload = {
      id: '123',
      title: 'abc',
    };

    // Act & Assert
    expect(() => new CreatedThread(payload)).toThrowError(
      'CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification ', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'abc',
      owner: true,
    };

    // Act & Assert
    expect(() => new CreatedThread(payload)).toThrowError(
      'CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create CreatedThread correctly', () => {
    // Arrange
    const payload = {
      id: '123',
      title: 'abc',
      owner: 'user',
    };

    // Act
    const { id, title, owner } = new CreatedThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });
});
