/*
  Warnings:

  - Added the required column `complaints` to the `MedicalRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MedicalRecord" ADD COLUMN     "complaints" TEXT NOT NULL;
