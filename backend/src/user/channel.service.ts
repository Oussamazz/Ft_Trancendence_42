import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto } from './user.dto';
import * as argon from 'argon2';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  async createChannel(id: number, channel: CreateChannelDto) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    if (!user) throw new NotFoundException('User not found');

    if (channel.type === 'protected') {
      if (!channel.password)
        throw new BadRequestException('No Password provided');
      if (channel.password && channel.password.length < 8)
        throw new BadRequestException(
          'Channel Password must be at least 8 characters long',
        );
      channel.password = await argon.hash(channel.password);
    }

    if (['private', 'protected', 'public'].includes(channel.type) == false) {
      throw new BadRequestException('Invalid channel type');
    }

    const isExist = await this.prisma.channel.findFirst({
      where: { name: channel.name },
    });
    if (isExist) throw new BadRequestException('Channel name already exists');

    const newChannel = await this.prisma.channel.create({
      data: {
        member: { connect: { id: user.id } },
        admins: { connect: { id: user.id } },
        name: channel.name,
        type: channel.type,
        password: channel.password,
        ownerId: user.id,
        adminsIds: { set: [user.id] },
      },
      select: {
        id: true,
        member: true,
        admins: true,
        name: true,
        ownerId: true,
      },
    });

    return newChannel;
  }

  async checkIsBlocked(id: number, channelID: number): Promise<boolean> {
    const checkBlock = await this.prisma.user.findFirst({
      where: {
        id: id,
        bannedFrom: {
          some: {
            id: channelID,
          },
        },
      },
    });

    if (checkBlock) return true;
    else return false;
  }

  async joinChannel(
    id: number,
    channelID: number,
    password: string | null,
  ): Promise<any> {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelID },
    });
    if (!channel) throw new NotFoundException('Channel not found');

    if (channel.type === 'private')
      throw new BadRequestException('Channel is private');

    const user = await this.prisma.user.findUnique({ where: { id: id } });
    if (!user) throw new NotFoundException('User not found');

    const isMember = await this.prisma.user.findFirst({
      where: {
        id: id,
        channels: { some: { id: channelID } },
      },
    });
    if (isMember)
      throw new BadRequestException('You already a member in channel');

    const isBlocked = await this.checkIsBlocked(user.id, channelID);
    if (isBlocked)
      throw new BadRequestException('You are blocked from Channel');

    if (channel.type === 'protected' && password) {
      const passCheck = await argon.verify(channel.password, password);
      if (!passCheck)
        throw new BadRequestException('Channel password is Wrong');
    } else if (channel.type === 'protected' && !password)
      throw new BadRequestException('Channel has a Password');

    if (user.id === channel.ownerId) {
      await this.prisma.channel.update({
        where: { id: channelID },
        data: {
          member: {
            connect: { id: id },
          },
          admins: {
            connect: { id: id },
          },
          adminsIds: {
            set: channel.adminsIds.concat(user.id),
          },
        },
      });
      return HttpStatus.ACCEPTED;
    }

    await this.prisma.channel.update({
      where: { id: channelID },
      data: {
        member: {
          connect: { id: id },
        },
        kicked: {
          disconnect: { id: id },
        },
      },
    });
    return HttpStatus.ACCEPTED;
  }

  async channelMembers(id: number, channelID: number) : Promise<any> {
	const channel = await this.prisma.channel.findUnique({
		where: {id: channelID},
		select: {
			member: {
				select: {
					id: true,
					username: true,
					avatar: true,
					userStatus: true,
				},
			},
		},
	});
	if (!channel) throw new NotFoundException("Channel Not found");

	const members = channel.member;

	const userChannels= (
		await this.prisma.user.findUnique({
			where: {id: id},
			select: {channels: true},
		})
	).channels;

	const isMember = userChannels.filter((chann) => chann.id === channelID);
	if (isMember.length === 0) throw new BadRequestException('User not a Member of channel');

	return members;
  }
  
  async leaveChannel(id: number, channelID: number) : Promise<any> {
	const isMember = await this.prisma.user.findFirst({
		where: {
			id: id,
			channels: {some: {id: channelID}},
		},
	});

	if (!isMember) throw new BadRequestException("User not a Member of channel")
  
	const isOwner = await this.prisma.channel.findFirst({
		where: {id: channelID},
	});

	await this.prisma.channel.update({
		where: {id: channelID},
		data: {
			member: {
				disconnect: {id: id}
			},
			admins: {
				disconnect: {id: id}
			},
			adminsIds: {
				set: isOwner.adminsIds.filter((adminID) => adminID !== id),
			},
		},
	});
	throw new HttpException('You left the channel', HttpStatus.OK);
  }

  async removeChannel(id: number, channelID: number) : Promise<any> {
	const channel = await this.prisma.channel.findUnique({where: {id: channelID}});
	if (!channel) throw new NotFoundException("Channel not found");

	if (channel.ownerId != id) throw new BadRequestException("User not Owner of channel");

	const msgs = await this.prisma.msg.findMany({where: {channelId: channelID}});
	for (const msg of msgs) {
		await this.prisma.msg.delete({
			where: {id: msg.id}
		});
	}

	const members = await this.prisma.channel.findUnique({
		where: {id: channelID},
		select: {
			member: {
				select: {
					id: true,
				},
			},
		},
	});
	for (const member of members.member) {
		await this.prisma.channel.update({
			where: {id: channelID},
			data: {
				member: {
					disconnect: {id: member.id}
				},
				admins: {
					disconnect: {id: member.id}
				},
			},
		});
	}

	await this.prisma.channel.delete({where: {id: channelID}});

	return HttpStatus.ACCEPTED;
  }

  async muteUser(id: number, targetID: number, channelID: number) : Promise<any> {
	const channel = await this.prisma.channel.findUnique({where: {id: channelID}});
	if (!channel) throw new NotFoundException("Channel not found");

	// check if user id exist
	// check if user id is in adminsIds of channel

	// check if targetID user is a member

	// if all checks out, connect target user to muted [] in db

	// 
  }
}
