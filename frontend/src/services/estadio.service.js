import api from "./api";

const estadioService = {
  getAll:   ()          => api.get("/estadio").then((r) => r.data),
  getById:  (id)        => api.get(`/estadio/${id}`).then((r) => r.data),
  create:   (dados)     => api.post("/estadio", dados).then((r) => r.data),
  update:   (id, dados) => api.put(`/estadio/${id}`, dados).then((r) => r.data),
  remove:   (id)        => api.delete(`/estadio/${id}`).then((r) => r.data),
};

export default estadioService;
