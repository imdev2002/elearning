/*
  Warnings:

  - You are about to drop the column `partNumber` on the `Lesson` table. All the data in the column will be lost.
  - Added the required column `partId` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "partNumber",
ADD COLUMN     "partId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
