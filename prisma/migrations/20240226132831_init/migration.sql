/*
  Warnings:

  - The `due` column on the `Edge` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `label` on the `Node` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Edge" ADD COLUMN     "label" TEXT,
ALTER COLUMN "style" DROP NOT NULL,
ALTER COLUMN "stroke" DROP NOT NULL,
DROP COLUMN "due",
ADD COLUMN     "due" INTEGER;

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Node" DROP COLUMN "label",
ALTER COLUMN "type" DROP NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;
