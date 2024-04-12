import { PrismaClient } from '@prisma/client';
import { Profile, Sections } from '../global';

const contentUtil = {
  refreshProfile: async (id: number, prisma: PrismaClient) => {
    const _profile = (await prisma.profile.findFirst({
      where: { id },
    })) as Profile;
    await prisma.profilesOnContentTiles.deleteMany({
      where: { profileId: id },
    });
    for (const item of _profile.sections as Sections) {
      for (const child of item.children) {
        if (child.type == 'content') {
          const _content = await prisma.contentTile.findFirst({
            where: { id: child.id },
          });
          if (!_content || _content.authorId !== _profile.ownerId) {
            child.id = undefined;
            continue;
          }
          await prisma.profilesOnContentTiles.create({
            data: {
              profile: { connect: { id } },
              contentTile: { connect: { id: _content.id } },
            },
          });
        }
      }
    }
    await prisma.profile.update({
      where: { id },
      data: { sections: _profile.sections },
    });
  },
};

export default contentUtil;
