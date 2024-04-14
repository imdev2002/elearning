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
  const user = await prisma.user.findFirst({
    where: { email: 'nguyendangkhai20@gmail.com' },
  });
  if (user) {
    await prisma.userRole.create({
      data: {
        user: { connect: { id: user.id } },
        role: { connect: { name: RoleEnum.ADMIN } },
      },
    });
  }
};

export default runner;
