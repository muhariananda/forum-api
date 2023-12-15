const LikeRepository = require('../LikeRepository');

describe('LikeRepository interface', () => {
  it('should return error when invoke unimplemented method', async () => {
    // Arrange
    const likeRepository = new LikeRepository();

    // Act & Assert
    await expect(likeRepository.addLike({})).rejects.toThrowError(
      'LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(likeRepository.getLikesCountByCommentId({})).rejects.toThrowError(
      'LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(likeRepository.deleteLike({})).rejects.toThrowError(
      'LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(likeRepository.hasCommentLiked({})).rejects.toThrowError(
      'LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
  });
});
