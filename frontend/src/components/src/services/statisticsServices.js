import api from "../api/axios"

export const getSummary = () => {
    return api.get("/statistics/summary");
};
export const getStatistics = (start, end) => {
  return api.get(
    `/statistics?start=${start}&end=${end}`
  );
};