import api from "./api";

export const authService = {
  login: (email, password, remember) =>
    api.post("/auth/login", { email, password, remember }),
  signup: (formData) =>
    api.post("/auth/signup", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  logout: () => api.post("/auth/logout"),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data, files) => {
    const form = new FormData();
    Object.keys(data).forEach((k) => {
      if (data[k] !== undefined && data[k] !== null) form.append(k, data[k]);
    });
    if (files?.profileImage) form.append("profileImage", files.profileImage);
    if (files?.resume) form.append("resume", files.resume);
    return api.put("/auth/profile", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) =>
    api.post("/auth/reset-password", { token, password }),
};
