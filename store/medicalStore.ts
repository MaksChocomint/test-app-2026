// store/medicalStore.ts
import { create } from "zustand";
import api from "@/lib/axios";
import { Pet, Vet } from "@/types/medicalRecord";

interface MedicalStore {
  pets: Pet[];
  vets: Vet[];
  selectedPetId: string | null;
  loading: boolean;
  error: string | null;

  setSelectedPetId: (id: string | null) => void;
  clearError: () => void;
  fetchPets: () => Promise<void>;
  fetchVets: () => Promise<void>;
  fetchAllData: () => Promise<void>;
  addMedicalRecord: (data: unknown) => Promise<void>;
  updateMedicalRecord: (id: string, data: unknown) => Promise<void>;
  deleteMedicalRecord: (id: string) => Promise<void>;
}

export const useMedicalStore = create<MedicalStore>((set, get) => ({
  pets: [],
  vets: [],
  selectedPetId: null,
  loading: false,
  error: null,

  setSelectedPetId: (id) => set({ selectedPetId: id }),

  clearError: () => set({ error: null }),

  fetchPets: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get("/pets?include=owner");
      set({ pets: response.data, loading: false });
    } catch (error) {
      set({
        error: `Ошибка при загрузке питомцев: ${error}`,
        loading: false,
      });
    }
  },

  fetchVets: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get("/vets");
      set({ vets: response.data, loading: false });
    } catch (error) {
      set({
        error: `Ошибка при загрузке ветеринаров: ${error}`,
        loading: false,
      });
    }
  },

  fetchAllData: async () => {
    const { fetchPets, fetchVets } = get();
    set({ loading: true, error: null });

    try {
      await Promise.all([fetchPets(), fetchVets()]);
      set({ loading: false });
    } catch (error) {
      set({
        error: `Ошибка при загрузке данных: ${error}`,
        loading: false,
      });
    }
  },
  addMedicalRecord: async (data) => {
    try {
      set({ loading: true, error: null });
      await api.post("/medical-records", data);
      set({ loading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Ошибка при создании медицинской записи";

      set({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  },

  updateMedicalRecord: async (id, data) => {
    try {
      set({ loading: true, error: null });
      await api.put(`/medical-records/${id}`, data);
      set({ loading: false });
    } catch (error) {
      set({
        error: "Ошибка при обновлении медицинской записи",
        loading: false,
      });
      throw error;
    }
  },

  deleteMedicalRecord: async (id) => {
    try {
      set({ loading: true, error: null });
      await api.delete(`/medical-records/${id}`);
      set({ loading: false });
    } catch (error) {
      set({
        error: "Ошибка при удалении медицинской записи",
        loading: false,
      });
      throw error;
    }
  },
}));
