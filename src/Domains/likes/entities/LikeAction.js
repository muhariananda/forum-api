class LikeAction {
  constructor(payload) {
    this._verifyPayload(payload);

    const { commentId, userId } = payload;

    this.commentId = commentId;
    this.userId = userId;
  }

  _verifyPayload({ commentId, userId }) {
    if (!commentId || !userId) {
      throw new Error('LIKE_ACTION.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const isString = (value) => typeof value === 'string';

    if (!isString(commentId) || !isString(userId)) {
      throw new Error('LIKE_ACTION.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = LikeAction;
