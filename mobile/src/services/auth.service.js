import api from "./api";

const authService = {
  login: (email, password) =>
    api("/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  register: (dados) =>
    api("/register", { method: "POST", body: JSON.stringify(dados) }),
};

export default authService;
