import { PrismaClient } from '@prisma/client';

const lessonUtil = {
  getLesson: async (prisma: PrismaClient, id: number, userId: number) => {
    const lesson = await prisma.lesson.findFirst({
      where: { id, userId },
      include: {
        comments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        hearts: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        emojis: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
    return lesson;
  },
  getLessons: async (
    prisma: PrismaClient,
    id: number,
    limit: number,
    offset: number,
  ) => {
    const lessons = await prisma.lesson.findMany({
      where: { userId: id },
      take: limit,
      skip: offset,
      include: {
        comments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        hearts: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        emojis: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
    return lessons;
  },
};
export default lessonUtil;
