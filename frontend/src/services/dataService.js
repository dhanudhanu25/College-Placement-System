import api from "./api";

export const studentService = {
  getAll: (params = {}) => api.get("/students", { params }),
  getById: (id) => api.get(`/students/${id}`),
  update: (id, data) => api.put(`/students/${id}`, data),
  remove: (id) => api.delete(`/students/${id}`),
  dashboard: () => api.get("/students/dashboard"),
  completion: () => api.get("/students/completion"),
};

export const companyService = {
  getAll: (params = {}) => api.get("/companies", { params }),
  getById: (id) => api.get(`/companies/${id}`),
  create: (data, logo) => {
    const form = new FormData();
    Object.keys(data).forEach((k) => form.append(k, data[k]));
    if (logo) form.append("logo", logo);
    return api.post("/companies", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  update: (id, data, logo) => {
    const form = new FormData();
    Object.keys(data).forEach((k) => form.append(k, data[k]));
    if (logo) form.append("logo", logo);
    return api.put(`/companies/${id}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  remove: (id) => api.delete(`/companies/${id}`),
  setApproval: (id, approved) =>
    api.put(`/companies/${id}/approval`, { approved }),
  dashboard: () => api.get("/companies/dashboard/me"),
};

export const jobService = {
  getAll: (params = {}) => api.get("/jobs", { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post("/jobs", data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  remove: (id) => api.delete(`/jobs/${id}`),
  setApproval: (id, approved) =>
    api.put(`/jobs/${id}/approval`, { approved }),
};

export const applicationService = {
  apply: (jobId) => api.post("/applications", { job: jobId }),
  getAll: (params = {}) => api.get("/applications", { params }),
  getById: (id) => api.get(`/applications/${id}`),
  update: (id, data) => api.put(`/applications/${id}`, data),
  remove: (id) => api.delete(`/applications/${id}`),
};

export const notificationService = {
  getAll: (params = {}) => api.get("/notifications", { params }),
  markAllRead: () => api.put("/notifications/read-all"),
  remove: (id) => api.delete(`/notifications/${id}`),
  create: (data) => api.post("/notifications", data),
};

export const adminService = {
  dashboard: () => api.get("/admin/dashboard"),
  pending: () => api.get("/admin/pending"),
  recruiters: (params = {}) => api.get("/admin/recruiters", { params }),
  users: (params = {}) => api.get("/admin/users", { params }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  report: () => api.get("/admin/report"),
};
