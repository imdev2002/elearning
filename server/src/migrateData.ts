import { PrismaClient, RoleEnum } from '@prisma/client';

const runner = async () => {
  const prisma = new PrismaClient();

  const roles = await prisma.role.findMany();
  if (roles.length === 0) {
    await prisma.role.create({
      data: {
        name: RoleEnum.USER,
        description: RoleEnum.USER,
      },
    });
    await prisma.role.create({
      data: {
        name: RoleEnum.ADMIN,
        description: RoleEnum.ADMIN,
      },
    });
    await prisma.role.create({
      data: {
        name: RoleEnum.AUTHOR,
        description: RoleEnum.AUTHOR,
      },
    });
  }
};

export default runner;
