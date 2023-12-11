class CreateReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { commentId, owner, content } = payload;

    this.commentId = commentId;
    this.owner = owner;
    this.content = content;
  }

  _verifyPayload({ commentId, owner, content }) {
    if (!commentId || !owner || !content) {
      throw new Error('CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const isString = (value) => typeof value === 'string';

    if (!isString(commentId) || !isString(owner) || !isString(content)) {
      throw new Error('CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CreateReply;
