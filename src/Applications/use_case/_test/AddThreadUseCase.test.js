const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CreateTread = require('../../../Domains/threads/entities/CreateThread');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'abc',
      body: 'abc',
    };

    const userId = 'user-123';

    const expectedCreatedThread = new CreatedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: userId,
    });

    const mockCreatedThread = new CreatedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: userId,
    });

    const mockThreadRepository = new ThreadRepository();

    /**
        mocking needed function
    */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockCreatedThread));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Act
    const createdThread = await addThreadUseCase.execute(useCasePayload, userId);

    // Assert
    expect(createdThread).toStrictEqual(expectedCreatedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new CreateTread({
      ...useCasePayload,
      owner: userId,
    }));
  });
});
