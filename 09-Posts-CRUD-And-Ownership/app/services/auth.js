function login(req, user) {
  req.session.userId = user.id;
}

function logout(req) {
  req.session.destroy(() => {});
}

const auth = {
  use(_guard) {
    return {
      async login(user, req) {
        login(req, user);
      },
    };
  },
};

module.exports = { auth, login, logout };
