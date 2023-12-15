class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, date, content, isDeleted, replies, likeCount,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = content;
    this.isDeleted = isDeleted;
    this.likeCount = likeCount;
    this.replies = replies;
  }

  _verifyPayload({
    id, username, date, content, isDeleted, replies, likeCount,
  }) {
    const isDefined = (value) => value !== undefined;

    if (
      !id || !username || !date
      || !content || !isDefined(isDeleted)
      || !replies || !isDefined(likeCount)
    ) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const isString = (value) => typeof value === 'string';

    if (
      !isString(id) || !isString(username)
      || !isString(date) || !isString(content)
      || typeof isDeleted !== 'boolean' || !Array.isArray(replies)
      || typeof likeCount !== 'number'
    ) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;
