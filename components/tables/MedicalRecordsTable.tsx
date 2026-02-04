"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { FileText } from "lucide-react";
import api from "@/lib/axios";
import { MedicalRecord } from "@/types/medicalRecord";
import { MedicalRecordRow } from "./MedicalRecordRow";
import { ModalDialog } from "../ui/ModalDialog";
import { EditMedicalRecordModal } from "../modals/EditMedicalRecordModal";

interface MedicalRecordsTableProps {
  petId?: string | null;
}

export interface MedicalRecordsTableRef {
  refresh: () => Promise<void>;
}

export const MedicalRecordsTable = React.memo(
  forwardRef<MedicalRecordsTableRef, MedicalRecordsTableProps>(
    ({ petId }, ref) => {
      const [records, setRecords] = useState<MedicalRecord[]>([]);
      const [loading, setLoading] = useState(true);
      const [expandedId, setExpandedId] = useState<string | null>(null);
      const [showDeleteModal, setShowDeleteModal] = useState(false);
      const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
      const [showAlertModal, setShowAlertModal] = useState(false);
      const [alertMessage, setAlertMessage] = useState("");
      const [showEditModal, setShowEditModal] = useState(false);
      const [recordToEdit, setRecordToEdit] = useState<MedicalRecord | null>(
        null,
      );

      const showAlert = useCallback((message: string) => {
        setAlertMessage(message);
        setShowAlertModal(true);
      }, []);

      const fetchRecords = useCallback(async () => {
        if (!petId) {
          setRecords([]);
          setLoading(false);
          return;
        }

        try {
          setLoading(true);
          const url = `/medical-records?petId=${petId}`;
          const response = await api.get(url);
          setRecords(response.data);
        } catch {
          showAlert("Не удалось загрузить медицинские записи");
        } finally {
          setLoading(false);
        }
      }, [petId, showAlert]);

      useImperativeHandle(ref, () => ({
        refresh: fetchRecords,
      }));

      // Загружаем данные при изменении petId
      useEffect(() => {
        void fetchRecords();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [petId]);

      const handleDeleteClick = useCallback((id: string) => {
        setRecordToDelete(id);
        setShowDeleteModal(true);
      }, []);

      const handleEditClick = useCallback((record: MedicalRecord) => {
        setRecordToEdit(record);
        setShowEditModal(true);
      }, []);

      const handleConfirmDelete = useCallback(async () => {
        if (!recordToDelete) return;

        try {
          await api.delete(`/medical-records/${recordToDelete}`);
          setShowDeleteModal(false);
          setRecordToDelete(null);
          showAlert("Медицинская запись успешно удалена");
          // После удаления обновляем данные
          await fetchRecords();
        } catch {
          showAlert("Не удалось удалить медицинскую запись");
          setShowDeleteModal(false);
          setRecordToDelete(null);
        }
      }, [recordToDelete, fetchRecords, showAlert]);

      const handleCancelDelete = useCallback(() => {
        setShowDeleteModal(false);
        setRecordToDelete(null);
      }, []);

      const handleSaveEdit = useCallback(
        async (
          id: string,
          data: {
            complaints: string;
            examination: string;
            diagnosis: string;
            treatment?: string | null;
            recommendations?: string | null;
          },
        ) => {
          try {
            await api.put(`/medical-records/${id}`, data);
            setShowEditModal(false);
            setRecordToEdit(null);
            showAlert("Медицинская запись успешно обновлена");
            // После редактирования обновляем данные
            await fetchRecords();
          } catch (error) {
            showAlert(`Не удалось обновить медицинскую запись: ${error}`);
          }
        },
        [fetchRecords, showAlert],
      );

      const handleCancelEdit = useCallback(() => {
        setShowEditModal(false);
        setRecordToEdit(null);
      }, []);

      const handleToggleExpand = useCallback((id: string) => {
        setExpandedId((prev) => (prev === id ? null : id));
      }, []);

      const memoizedRecords = useMemo(() => records, [records]);

      if (loading) {
        return (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-mint"></div>
          </div>
        );
      }

      return (
        <>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Медицинские записи {petId && `(${records.length})`}
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {memoizedRecords.map((record) => (
                <MedicalRecordRow
                  key={record.id}
                  record={record}
                  expanded={expandedId === record.id}
                  onToggle={handleToggleExpand}
                  onDelete={handleDeleteClick}
                  onEdit={handleEditClick}
                />
              ))}
            </div>

            {memoizedRecords.length === 0 && petId && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Нет медицинских записей</p>
              </div>
            )}

            {!petId && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">
                  Выберите питомца для просмотра записей
                </p>
              </div>
            )}
          </div>
          {/* Модальное окно подтверждения удаления */}
          <ModalDialog
            isOpen={showDeleteModal}
            title="Удаление медицинской записи"
            message="Вы уверены, что хотите удалить эту медицинскую запись? Это действие нельзя отменить."
            confirmText="Удалить"
            cancelText="Отмена"
            type="confirm"
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />

          {/* Модальное окно редактирования */}
          {showEditModal && recordToEdit && (
            <EditMedicalRecordModal
              record={recordToEdit}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
            />
          )}

          {/* Модальное окно уведомления */}
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
    },
  ),
);

MedicalRecordsTable.displayName = "MedicalRecordsTable";
