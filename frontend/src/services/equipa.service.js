import api from "./api";

const equipaService = {
  getAll:   ()          => api.get("/equipa").then((r) => r.data),
  getById:  (id)        => api.get(`/equipa/${id}`).then((r) => r.data),

  // JSON — usado quando não há upload de ficheiro
  create:   (dados)     => api.post("/equipa", dados).then((r) => r.data),
  update:   (id, dados) => api.put(`/equipa/${id}`, dados).then((r) => r.data),
  remove:   (id)        => api.delete(`/equipa/${id}`).then((r) => r.data),

  // FormData — usado quando há upload de logo
  createForm: (formData) =>
    api.post("/equipa", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((r) => r.data),

  updateForm: (id, formData) =>
    api.put(`/equipa/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((r) => r.data),
};

export default equipaService;
