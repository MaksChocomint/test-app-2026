"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { MedicalRecord } from "@/types/medicalRecord";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import {
  medicalRecordUpdateSchema,
  type MedicalRecordUpdateData,
} from "@/lib/schema";

interface EditMedicalRecordModalProps {
  record: MedicalRecord;
  onSave: (id: string, data: MedicalRecordUpdateData) => Promise<void>;
  onCancel: () => void;
}

export const EditMedicalRecordModal = ({
  record,
  onSave,
  onCancel,
}: EditMedicalRecordModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<MedicalRecordUpdateData>({
    resolver: zodResolver(medicalRecordUpdateSchema),
    defaultValues: {
      complaints: record.complaints || "",
      examination: record.examination || "",
      diagnosis: record.diagnosis || "",
      treatment: record.treatment || "",
      recommendations: record.recommendations || "",
    },
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  const onSubmit = async (data: MedicalRecordUpdateData) => {
    try {
      // Подготавливаем данные для отправки
      const updateData = {
        complaints: data.complaints.trim(),
        examination: data.examination.trim(),
        diagnosis: data.diagnosis.trim(),
        treatment: data.treatment?.trim() || null,
        recommendations: data.recommendations?.trim() || null,
      };

      await onSave(record.id, updateData);
      // onCancel вызывается в родительском компоненте после успешного сохранения
    } catch (error) {
      console.error("Ошибка при сохранении записи:", error);

      // Устанавливаем общую ошибку формы
      setError("root", {
        type: "manual",
        message:
          error instanceof Error
            ? error.message
            : "Не удалось сохранить изменения",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h3 className="text-lg font-semibold text-gray-900">
            Редактирование медицинской записи
          </h3>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-y-auto max-h-[calc(90vh-120px)]"
        >
          <div className="p-6 space-y-6">
            {errors.root && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{errors.root.message}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Информация о записи:
                  </p>
                  <p className="font-medium">
                    {record.pet.name} • {record.pet.owner.name} •{" "}
                    {new Date(record.createdAt).toLocaleDateString("ru-RU")}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Ветеринар: {record.vet.name}
                  </p>
                </div>
              </div>

              <div className="md:col-span-2">
                <Textarea
                  {...register("complaints")}
                  label="Жалобы"
                  error={errors.complaints?.message}
                  required
                  rows={3}
                  placeholder="Жалобы владельца на состояние питомца..."
                  disabled={isSubmitting}
                />
              </div>

              <div className="md:col-span-2">
                <Textarea
                  {...register("examination")}
                  label="Результаты осмотра"
                  error={errors.examination?.message}
                  required
                  rows={3}
                  placeholder="Результаты проведенного осмотра..."
                  disabled={isSubmitting}
                />
              </div>

              <div className="md:col-span-2">
                <Textarea
                  {...register("diagnosis")}
                  label="Диагноз"
                  error={errors.diagnosis?.message}
                  required
                  rows={2}
                  placeholder="Поставленный диагноз..."
                  disabled={isSubmitting}
                />
              </div>

              <div className="md:col-span-2">
                <Textarea
                  {...register("treatment")}
                  label="Назначенное лечение"
                  error={errors.treatment?.message}
                  rows={2}
                  placeholder="Прописанное лечение и препараты..."
                  disabled={isSubmitting}
                />
              </div>

              <div className="md:col-span-2">
                <Textarea
                  {...register("recommendations")}
                  label="Рекомендации"
                  error={errors.recommendations?.message}
                  rows={2}
                  placeholder="Рекомендации владельцу..."
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 p-6 border-t border-gray-200 sticky bottom-0 bg-white">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="flex-1"
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="flex-1"
            >
              Сохранить изменения
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
