-- CreateEnum
CREATE TYPE "FormStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "SubmitForm" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "real_firstName" TEXT NOT NULL,
    "real_lastName" TEXT NOT NULL,
    "selfie" TEXT,
    "frontIdCard" TEXT,
    "backIdCard" TEXT,
    "status" "FormStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "SubmitForm_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SubmitForm" ADD CONSTRAINT "SubmitForm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
