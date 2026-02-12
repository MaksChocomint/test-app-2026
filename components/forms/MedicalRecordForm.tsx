"use client";
import { useEffect, useState, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { medicalRecordSchema, type MedicalRecordFormData } from "@/lib/schema";
import api from "@/lib/axios";
import { Appointment } from "@/types/medicalRecord";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { ModalDialog } from "@/components/ui/ModalDialog";
import { useMedicalStore } from "@/store/medicalStore";
import { AxiosError } from "axios";

interface MedicalRecordFormProps {
  onSuccess: () => void;
  selectedPetId?: string | null;
}

export const MedicalRecordForm = ({
  onSuccess,
  selectedPetId,
}: MedicalRecordFormProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const {
    pets,
    vets,
    selectedPetId: storeSelectedPetId,
    addMedicalRecord,
  } = useMedicalStore();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<MedicalRecordFormData>({
    resolver: zodResolver(medicalRecordSchema),
  });

  const currentPetId = useWatch({
    control,
    name: "petId",
  });

  const selectedPet = useMemo(() => {
    return pets.find((pet) => pet.id === (selectedPetId || storeSelectedPetId));
  }, [pets, selectedPetId, storeSelectedPetId]);

  useEffect(() => {
    const petId = selectedPetId || storeSelectedPetId;
    if (petId) {
      setValue("petId", petId);
    }
  }, [selectedPetId, storeSelectedPetId, setValue]);

  useEffect(() => {
    if (!currentPetId) return;

    const loadAppointments = async () => {
      try {
        const response = await api.get(`/appointments?petId=${currentPetId}`);
        setAppointments(response.data);
      } catch (error) {
        setAlertMessage(`Ошибка при загрузке записей на прием: ${error}`);
        setShowAlertModal(true);
        setAppointments([]);
      }
    };

    loadAppointments();
  }, [currentPetId]);

  const onSubmit = async (data: MedicalRecordFormData) => {
    try {
      const formData = {
        ...data,
        appointmentId: data.appointmentId?.trim() || null,
      };

      await addMedicalRecord(formData);
      reset();
      onSuccess();
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;

      const errorMessage =
        axiosError.response?.data?.error ||
        axiosError.message ||
        "Ошибка при создании медицинской записи";

      setAlertMessage(errorMessage);
      setShowAlertModal(true);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-6 rounded-xl shadow-sm"
      >
        <div className="flex items-center gap-2 mb-6">
          <button
            type="button"
            onClick={onSuccess}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-bold text-brand-dark">
            Новая медицинская запись
          </h2>
        </div>

        {selectedPet && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="font-medium text-gray-800">
              {selectedPet.name} • {selectedPet.owner?.name}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="hidden" {...register("petId")} />

          <Select
            {...register("vetId")}
            label="Ветеринар"
            error={errors.vetId?.message}
            required
          >
            <option value="">Выберите ветеринара</option>
            {vets.map((vet) => (
              <option key={vet.id} value={vet.id}>
                {vet.name} {vet.specialization ? `(${vet.specialization})` : ""}
              </option>
            ))}
          </Select>

          <div className="md:col-span-2">
            <Select
              {...register("appointmentId")}
              label="Запись на прием"
              error={errors.appointmentId?.message}
            >
              <option value="">Выберите запись на прием (если есть)</option>
              {appointments.map((appointment) => (
                <option key={appointment.id} value={appointment.id}>
                  {new Date(appointment.date).toLocaleDateString()} -{" "}
                  {appointment.reason}
                </option>
              ))}
            </Select>
            <p className="text-sm text-gray-500 mt-1">
              Можно оставить пустым для приема без записи
            </p>
          </div>

          <div className="md:col-span-2">
            <Textarea
              {...register("complaints")}
              label="Жалобы"
              error={errors.complaints?.message}
              required
              rows={3}
              placeholder="Жалобы владельца на состояние питомца..."
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
            />
          </div>

          <div className="md:col-span-2">
            <Textarea
              {...register("treatment")}
              label="Назначенное лечение"
              error={errors.treatment?.message}
              rows={2}
              placeholder="Прописанное лечение и препараты..."
            />
          </div>

          <div className="md:col-span-2">
            <Textarea
              {...register("recommendations")}
              label="Рекомендации"
              error={errors.recommendations?.message}
              rows={2}
              placeholder="Рекомендации владельцу..."
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="flex-1"
            disabled={!selectedPet}
          >
            Создать запись
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={onSuccess}
            className="flex-1"
          >
            Отмена
          </Button>
        </div>
      </form>

      <ModalDialog
        isOpen={showAlertModal}
        title="Уведомление"
        message={alertMessage}
        confirmText="OK"
        type="alert"
        onConfirm={() => setShowAlertModal(false)}
        onCancel={() => setShowAlertModal(false)}
      />
    </>
  );
};
