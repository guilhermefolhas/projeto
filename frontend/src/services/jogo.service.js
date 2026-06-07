import api from "./api";

const jogoService = {
  getAll:   (jornada) => api.get("/jogo", { params: jornada ? { jornada } : {} }).then((r) => r.data),
  getById:  (id)      => api.get(`/jogo/${id}`).then((r) => r.data),
  create:   (dados)   => api.post("/jogo", dados).then((r) => r.data),
  update:   (id, dados) => api.put(`/jogo/${id}`, dados).then((r) => r.data),
  remove:   (id)      => api.delete(`/jogo/${id}`).then((r) => r.data),
};

export default jogoService;
