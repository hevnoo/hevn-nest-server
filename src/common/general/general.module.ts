import { Module } from '@nestjs/common';
import { GeneralController } from './general.controller';
import { GeneralService } from './general.service';
import { PrismaService } from '@/common/prisma/prisma.service';

@Module({
  controllers: [GeneralController],
  providers: [
    PrismaService,
    {
      provide: GeneralService,
      useFactory: (prisma: PrismaService) => {
        return new GeneralService(prisma);
      },
      inject: [PrismaService],
    },
  ],
  exports: [GeneralService],
})
export class GeneralModule {}
