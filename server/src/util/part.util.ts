import { PrismaClient } from '@prisma/client';

const partUtil = {
  prisma: new PrismaClient(),
  refreshPart: async (courseId: string | number) => {
    let count = 1;
    courseId = Number(courseId);
    const parts = await partUtil.prisma.part.findMany({
      where: { courseId },
      orderBy: { partNumber: 'asc' },
    });
    for (const _ of parts) {
      await partUtil.prisma.part.update({
        where: { id: _.id },
        data: { partNumber: count++ },
      });
    }
  },
};
export default partUtil;
