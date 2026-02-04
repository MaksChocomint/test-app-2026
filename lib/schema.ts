import { z } from "zod";

export const medicalRecordSchema = z.object({
  complaints: z.string().min(3, "Опишите жалобы владельца (минимум 3 символа)"),
  examination: z
    .string()
    .min(3, "Опишите результаты осмотра (минимум 3 символа)"),
  diagnosis: z.string().min(3, "Укажите диагноз (минимум 3 символа)"),
  treatment: z.string().optional(),
  recommendations: z.string().optional(),
  petId: z.string().min(1, "Выберите питомца"),
  vetId: z.string().min(1, "Выберите ветеринара"),
  appointmentId: z.string().optional(),
});

export const medicalRecordUpdateSchema = z.object({
  complaints: z.string().min(3, "Жалобы должны содержать минимум 3 символов"),
  examination: z
    .string()
    .min(3, "Результаты осмотра должны содержать минимум 3 символов"),
  diagnosis: z.string().min(3, "Диагноз должен содержать минимум 3 символов"),
  treatment: z.string().nullable().optional(),
  recommendations: z.string().nullable().optional(),
});

export type MedicalRecordUpdateData = z.infer<typeof medicalRecordUpdateSchema>;
export type MedicalRecordFormData = z.infer<typeof medicalRecordSchema>;
