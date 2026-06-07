import api from "./api";

const equipaService = {
  getAll:  ()   => api("/equipa"),
  getById: (id) => api(`/equipa/${id}`),
};

export default equipaService;
