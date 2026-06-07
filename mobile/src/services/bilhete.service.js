import api from "./api";

const bilheteService = {
  getAll:  (id_jogo) => api(id_jogo ? `/bilhete?id_jogo=${id_jogo}` : "/bilhete"),
  getById: (id)      => api(`/bilhete/${id}`),
};

export default bilheteService;
