import api from "./api";

const compraService = {
  create:          (dados)      => api.post("/compra", dados).then((r) => r.data),
  getByCliente:    (id_cliente) => api.get(`/compra/cliente/${id_cliente}`).then((r) => r.data),
  getAll:          ()           => api.get("/compra").then((r) => r.data),
  getById:         (id)         => api.get(`/compra/${id}`).then((r) => r.data),
  updateEstado:    (id, estado) => api.put(`/compra/${id}`, { estado }).then((r) => r.data),
  remove:          (id)         => api.delete(`/compra/${id}`).then((r) => r.data),
  getDisponibilidade: (id_jogo)  => api.get(`/compra/disponibilidade/jogo/${id_jogo}`).then((r) => r.data),
};

export default compraService;