import { api } from "./api";

export type EmissionCategory = "Transport" | "Energy" | "Food" | "Waste";

export type CreateEmissionPayload = {
  company?: number;
  category: EmissionCategory | string;
  value: number;
  date?: string;
  unit?: string; // server fills it from the category
};

export type EmissionRecord = {
  id: number;
  company: number;
  date: string;
  category: string;
  value: number;
  unit: string;
  co2e_impact: number;
  created_at: string;
};

export type CategoryInfo = { key: string; unit: string; factor: number };

export const categoriesApi = {
  list: async () => {
    const res = await api.get("/categories/");
    return res.data as CategoryInfo[];
  },
};

export const emissionsApi = {
  create: async (payload: CreateEmissionPayload) => {
    const res = await api.post("/emissions/", payload);
    return res.data as EmissionRecord;
  },

  list: async () => {
    const res = await api.get("/emissions/");
    return res.data as EmissionRecord[];
  },
};
