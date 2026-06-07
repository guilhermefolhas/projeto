import api from "./api";

const authService = {
  login: (email, password) =>
    api.post("/login", { email, password }).then((r) => r.data),

  register: (email, password) =>
    api.post("/register", { email, password }).then((r) => r.data),
};

export default authService;
