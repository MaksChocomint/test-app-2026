"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PetHeader } from "@/components/ui/PetHeader";
import { PetSelector } from "@/components/ui/PetSelector";
import {
  MedicalRecordsTable,
  MedicalRecordsTableRef,
} from "@/components/tables/MedicalRecordsTable";
import { MedicalRecordForm } from "@/components/forms/MedicalRecordForm";
import { InfoCard } from "@/components/ui/InfoCard";
import { ModalDialog } from "@/components/ui/ModalDialog";
import { useMedicalStore } from "@/store/medicalStore";

export default function Home() {
  const {
    pets,
    selectedPetId,
    error,
    loading,
    setSelectedPetId,
    fetchAllData,
    clearError,
  } = useMedicalStore();

  const [showForm, setShowForm] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const tableRef = useRef<MedicalRecordsTableRef>(null);

  // Загружаем ВСЕ данные при монтировании
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleCreateSuccess = useCallback(() => {
    setShowForm(false);
    if (tableRef.current) {
      tableRef.current.refresh();
    }
  }, []);

  const handlePetChange = useCallback(
    (petId: string | null) => {
      setSelectedPetId(petId);
    },
    [setSelectedPetId],
  );

  const handleToggleForm = useCallback(() => {
    setShowForm((prev) => !prev);
  }, []);

  const handleErrorModalClose = useCallback(() => {
    setShowErrorModal(false);
    clearError();
  }, [clearError]);

  return (
    <div className="p-8 space-y-8">
      <header className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm p-6 flex items-center gap-6">
        <PetHeader />
        <PetSelector
          pets={pets}
          selectedPetId={selectedPetId}
          onPetChange={handlePetChange}
          onToggleForm={handleToggleForm}
          showForm={showForm}
          loading={loading}
        />
      </header>

      <main className="max-w-6xl mx-auto space-y-6">
        {showForm ? (
          <MedicalRecordForm
            onSuccess={handleCreateSuccess}
            selectedPetId={selectedPetId}
          />
        ) : selectedPetId ? null : (
          <InfoCard
            title="Выберите питомца"
            description="Для просмотра или создания медицинских записей выберите питомца из списка выше."
          />
        )}

        <section>
          <MedicalRecordsTable ref={tableRef} petId={selectedPetId} />
        </section>
      </main>

      <ModalDialog
        isOpen={showErrorModal}
        title="Ошибка"
        message={error || "Произошла неизвестная ошибка"}
        confirmText="OK"
        type="alert"
        onConfirm={handleErrorModalClose}
        onCancel={handleErrorModalClose}
      />
    </div>
  );
}
