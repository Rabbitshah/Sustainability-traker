import { api } from "./api";

export const emissionsApi = {
  create: async (payload: {
    company: number;
    category: string;
    value: number;
    date?: string;
    unit: string;
  }) => {
    const res = await api.post("/emissions/", payload);
    return res.data;
  },

  list: async () => {
    const res = await api.get("/emissions/");
    return res.data;
  },
};
