/* istanbul ignore file */
const Jwt = require('@hapi/jwt');

const ServerTestHelper = {
  async getAccessToken({
    id = 'user-123',
    username = 'dummy',
    password = 'secret',
    fullname = 'Dummy name',
  }) {
    const userPayload = {
      id,
      username,
      password,
      fullname,
    };

    return Jwt.token.generate(userPayload, process.env.ACCESS_TOKEN_KEY);
  },
};

module.exports = ServerTestHelper;
