import { PrismaClient } from '@prisma/client';
import { Profile, Sections, UserEventStatus } from '../global';

const eventUtil = {
  refreshProfile: async (id: number, prisma: PrismaClient) => {
    const _profile = (await prisma.profile.findFirst({
      where: { id },
    })) as Profile;
    await prisma.profilesOnEventTiles.deleteMany({
      where: { profileId: id },
    });
    for (const item of _profile.sections as Sections) {
      for (const child of item.children) {
        if (child.type == 'event') {
          const _event = await prisma.eventTile.findFirst({
            where: { id: child.id },
            include: {
              participants: true,
            },
          });
          if (
            !_event ||
            !_event?.participants.find(
              (_) =>
                _.userId === _profile.ownerId &&
                _.userStatus === UserEventStatus.CREATOR,
            )
          ) {
            child.id = undefined;
            continue;
          }
          await prisma.profilesOnEventTiles.create({
            data: {
              profile: { connect: { id } },
              eventTile: { connect: { id: _event.id } },
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

export default eventUtil;
