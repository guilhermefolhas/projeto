import api from "./api";

const bilheteService = {
  getAll:    (id_jogo) => api.get("/bilhete", { params: id_jogo ? { id_jogo } : {} }).then((r) => r.data),
  getById:   (id)      => api.get(`/bilhete/${id}`).then((r) => r.data),
  create:    (dados)   => api.post("/bilhete", dados).then((r) => r.data),
  update:    (id, dados) => api.put(`/bilhete/${id}`, dados).then((r) => r.data),
  remove:    (id)      => api.delete(`/bilhete/${id}`).then((r) => r.data),
};

export default bilheteService;
