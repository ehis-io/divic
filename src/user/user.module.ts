import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';

import { PrismaModule } from '../config/prisma.module';
import { PrismaService } from '../config/prisma.service';
import { UserResolver } from './resolver/user.resolver';

@Module({
  imports: [],

  providers: [UserService, PrismaService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
