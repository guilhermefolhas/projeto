import api from "./api";

const jogoService = {
  getAll:  ()   => api("/jogo"),
  getById: (id) => api(`/jogo/${id}`),
  create:  (d)  => api("/jogo", { method: "POST", body: JSON.stringify(d) }),
  update:  (id, d) => api(`/jogo/${id}`, { method: "PUT", body: JSON.stringify(d) }),
  remove:  (id) => api(`/jogo/${id}`, { method: "DELETE" }),
};

export default jogoService;
