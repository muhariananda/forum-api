class ReplyDetails {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, content, date, username, commentId, isDeleted,
    } = payload;

    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
    this.commentId = commentId;
    this.isDeleted = isDeleted;
  }

  _verifyPayload({
    id, content, date, username, commentId, isDeleted,
  }) {
    if (!id || !content || !date || !username || !commentId || isDeleted === undefined) {
      throw new Error('REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const isString = (value) => typeof value === 'string';
    const isBoolean = (value) => typeof value === 'boolean';

    if (
      !isString(id) || !isString(content) || !isString(date)
      || !isString(username) || !isString(commentId) || !isBoolean(isDeleted)
    ) {
      throw new Error('REPLY_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ReplyDetails;
