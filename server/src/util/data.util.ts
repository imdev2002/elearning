import { PrismaClient } from '@prisma/client';

const DataUtil = {
  processAuthorReport: (data: any, limit = 5) => {
    const result = {} as any;
    for (const _ in data) {
      result[_] = [];
      for (const __ in data[_]) {
        result[_].push({
          author: {
            id: parseInt(__),
            ...data[_][__].author,
          },
          total: data[_][__].total,
          revenue: data[_][__].revenue,
        });
      }
      result[_] = result[_].sort(
        (a: any, b: any) => b.revenue - a.revenue,
      ).slice(0, limit);
    }

    return result;
  },
  processStarReport: async (data: any, prisma: PrismaClient) => {
    const total = {
      course: { id: -1, name: 'Total' },
      stars: [
        { star: 1, total: 0 },
        { star: 2, total: 0 },
        { star: 3, total: 0 },
        { star: 4, total: 0 },
        { star: 5, total: 0 },
        { avgStar: 0, total: 0 },
      ],
    };
    let totalRate = 0;
    let totalStar = 0;
    const result = [] as any[];
    for (const _ in data) {
      const course = await prisma.course.findUnique({
        where: { id: parseInt(_) },
      });
      if (!course) {
        continue;
      }
      if (!course.totalRating || !course.avgRating) {
        continue;
      }
      totalRate += course.totalRating;
      totalStar += course.avgRating * course.totalRating;
      result.push({
        course: {
          id: course.id,
          name: course.courseName,
          thumbnail: course.thumbnail,
        },
        stars: data[_],
      });
      for (const __ of data[_]) {
        if (!__.star) {
          continue;
        }
        total.stars[__.star - 1].total += __.total;
      }
    }
    total.stars[5].avgStar = totalStar / totalRate;
    total.stars[5].total = totalRate;
    result.push(total);
    return result;
  },
};

export default DataUtil;
