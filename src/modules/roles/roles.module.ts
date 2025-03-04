import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { PrismaService } from '@/common/prisma/prisma.service';

@Module({
  controllers: [RolesController],
  providers: [RolesService, PrismaService],
})
export class RolesModule {}
