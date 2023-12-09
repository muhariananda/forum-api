const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CreateTread = require('../../../Domains/threads/entities/CreateThread');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const mockUserId = 'user-123';
    const useCasePayload = {
      title: 'abc',
      body: 'abc',
    };

    const expectedCreatedThread = new CreatedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: mockUserId,
    });

    const mockThreadRepository = new ThreadRepository();

    /**
        mocking needed function
    */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedCreatedThread));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Act
    const createdThread = await addThreadUseCase.execute(useCasePayload, mockUserId);

    // Assert
    expect(createdThread).toStrictEqual(expectedCreatedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new CreateTread({
      ...useCasePayload,
      owner: mockUserId,
    }));
  });
});
