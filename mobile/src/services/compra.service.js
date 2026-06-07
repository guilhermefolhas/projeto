import api from "./api";

const compraService = {
  create:             (d)          => api("/compra", { method: "POST", body: JSON.stringify(d) }),
  getByCliente:       (id_cliente) => api(`/compra/cliente/${id_cliente}`),
  getDisponibilidade: (id_jogo)    => api(`/compra/disponibilidade/jogo/${id_jogo}`),
};

export default compraService;
