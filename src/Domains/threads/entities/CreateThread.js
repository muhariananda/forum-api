class CreateThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { title, body, owner } = payload;

    this.title = title;
    this.body = body;
    this.owner = owner;
  }

  _verifyPayload({ title, body, owner }) {
    const isString = (value) => typeof value === 'string';

    if (!title || !body || !owner) {
      throw new Error('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (!isString(title) || !isString(body) || !isString(owner)) {
      throw new Error('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CreateThread;
