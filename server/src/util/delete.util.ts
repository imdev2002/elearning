import { PrismaClient } from '@prisma/client';
import courseUtil from './course.util';

export const DeleteUtil = {
  prisma: new PrismaClient(),
  deleteCourse: async (id: number) => {
    try {
      await DeleteUtil.prisma.comment.deleteMany({ where: { courseId: id } });
      await DeleteUtil.prisma.emoji.deleteMany({ where: { courseId: id } });
      await DeleteUtil.prisma.heart.deleteMany({ where: { courseId: id } });
      const parts = await DeleteUtil.prisma.part.findMany({
        where: { courseId: id },
        include: { lessons: true },
      });
      for (const part of parts) {
        for (const lesson of part.lessons) {
          await DeleteUtil.prisma.comment.deleteMany({
            where: { lessonId: lesson.id },
          });
          await DeleteUtil.prisma.emoji.deleteMany({
            where: { lessonId: lesson.id },
          });
          await DeleteUtil.prisma.heart.deleteMany({
            where: { lessonId: lesson.id },
          });
          await DeleteUtil.prisma.bookmark.deleteMany({
            where: { lessonId: lesson.id },
          });
          await DeleteUtil.prisma.lessonDone.deleteMany({
            where: { lessonId: lesson.id },
          });
        }
        await DeleteUtil.prisma.lesson.deleteMany({
          where: { partId: part.id },
        });
        await DeleteUtil.prisma.part.delete({ where: { id: part.id } });
      }
      await DeleteUtil.prisma.rating.deleteMany({ where: { courseId: id } });
      await DeleteUtil.prisma.bookmark.deleteMany({ where: { courseId: id } });
      await DeleteUtil.prisma.coursesPaid.deleteMany({
        where: { courseId: id },
      });
      await DeleteUtil.prisma.courseDone.deleteMany({
        where: { courseId: id },
      });
      await DeleteUtil.prisma.course.delete({ where: { id } });
    } catch (error) {
      console.log(error);
    }
  },
  deleteLesson: async (id: number) => {
    try {
      const lesson = await DeleteUtil.prisma.lesson.findFirst({
        where: { id },
        include: { part: true },
      });
      await DeleteUtil.prisma.comment.deleteMany({ where: { lessonId: id } });
      await DeleteUtil.prisma.emoji.deleteMany({ where: { lessonId: id } });
      await DeleteUtil.prisma.heart.deleteMany({ where: { lessonId: id } });
      await DeleteUtil.prisma.bookmark.deleteMany({ where: { lessonId: id } });
      await DeleteUtil.prisma.lessonDone.deleteMany({
        where: { lessonId: id },
      });
      await DeleteUtil.prisma.lesson.delete({ where: { id } });
      await courseUtil.refreshCourse(
        DeleteUtil.prisma,
        lesson?.part.courseId || 0,
      );
    } catch (error) {
      console.log(error);
    }
  },
  deletePart: async (id: number) => {
    const part = await DeleteUtil.prisma.part.findFirst({
      where: { id },
      include: { course: true },
    });
    const lessons = await DeleteUtil.prisma.lesson.findMany({
      where: { partId: id },
    });
    for (const lesson of lessons) {
      await DeleteUtil.prisma.comment.deleteMany({
        where: { lessonId: lesson.id },
      });
      await DeleteUtil.prisma.emoji.deleteMany({
        where: { lessonId: lesson.id },
      });
      await DeleteUtil.prisma.heart.deleteMany({
        where: { lessonId: lesson.id },
      });
      await DeleteUtil.prisma.bookmark.deleteMany({
        where: { lessonId: lesson.id },
      });
      await DeleteUtil.prisma.lessonDone.deleteMany({
        where: { lessonId: lesson.id },
      });
    }
    await DeleteUtil.prisma.lesson.deleteMany({ where: { partId: id } });
    await DeleteUtil.prisma.part.delete({ where: { id } });
    await courseUtil.refreshCourse(DeleteUtil.prisma, part?.courseId || 0);
  },
};
