/*
  Warnings:

  - Added the required column `markerEnd` to the `Edge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Edge" ADD COLUMN     "markerEnd" JSONB NOT NULL;
