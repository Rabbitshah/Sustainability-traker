import { api } from "./api";

export const kpiApi = {
  total: async () => {
    const res = await api.get("/kpis/total/");
    return res.data as { total_emissions: number };
  },

  category: async () => {
    const res = await api.get("/kpis/category/");
    return res.data as { category: string; value: number }[];
  },

  monthly: async () => {
    const res = await api.get("/kpis/monthly/");
    return res.data as { month: string; value: number }[];
  },
};
