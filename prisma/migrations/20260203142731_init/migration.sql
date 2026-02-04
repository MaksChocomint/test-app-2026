/*
  Warnings:

  - You are about to drop the column `complaints` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `examination` on the `MedicalRecord` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MedicalRecord" DROP COLUMN "complaints",
DROP COLUMN "examination";
