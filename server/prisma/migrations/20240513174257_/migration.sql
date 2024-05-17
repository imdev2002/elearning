/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `SubmitForm` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SubmitForm_userId_key" ON "SubmitForm"("userId");
