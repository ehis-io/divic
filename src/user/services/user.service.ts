import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../config/prisma.service';

import { CreateUser } from '../dto/create.user';
import { User } from '../models/user';

@Injectable()
export class UserService {
  getById(userId: number) {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly prismaService: PrismaService) {}
  roundsOfHashing = 10;
  logger = new Logger(UserService.name);
  /**
   *
   * @param createUser
   * @returns {User}
   */
  async createUser(createUser: CreateUser): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(
        createUser.password,
        this.roundsOfHashing,
      );
      createUser.password = hashedPassword;

      return await this.prismaService.user.create({ data: createUser });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(
        'Please wait a few minuites before trying again',
      );
    }
  }

  /**
   *
   * @param id
   * @returns {user}
   */
  async findOne(id: string): Promise<User | null> {
    try {
      return await this.prismaService.user.findUnique({
        where: { id },
      });
    } catch (error) {
      this.logger.log(error);
      throw new BadRequestException('Invalid Id');
    }
  }

  async findByEmail(email: string): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: { email },
    });
  }
}
