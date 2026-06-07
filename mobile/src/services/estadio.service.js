import api from "./api";

const estadioService = {
  getAll:  ()   => api("/estadio"),
  getById: (id) => api(`/estadio/${id}`),
};

export default estadioService;
