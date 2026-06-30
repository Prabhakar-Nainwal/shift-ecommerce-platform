import api from "../api/axios";

export const createCategory = (formData) => {
  return api.post("/categories", formData);
};

export const getCategories = () => {
  return api.get("/categories");
};

export const updateCategory = (id, formData) => {
  return api.patch(`/categories/${id}`, formData);
};