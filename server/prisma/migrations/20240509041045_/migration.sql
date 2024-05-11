-- CreateTable
CREATE TABLE "LessonDone" (
    "lessonId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "LessonDone_pkey" PRIMARY KEY ("userId","lessonId")
);

-- CreateTable
CREATE TABLE "CourseDone" (
    "courseId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "CourseDone_pkey" PRIMARY KEY ("userId","courseId")
);

-- AddForeignKey
ALTER TABLE "LessonDone" ADD CONSTRAINT "LessonDone_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonDone" ADD CONSTRAINT "LessonDone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseDone" ADD CONSTRAINT "CourseDone_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseDone" ADD CONSTRAINT "CourseDone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
