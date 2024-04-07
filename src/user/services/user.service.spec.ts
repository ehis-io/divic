import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../config/prisma.service';
import { CreateUser } from '../dto/create.user';
import { User } from '../models/user';
import * as bcrypt from 'bcrypt';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const prismaServiceMock = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
};
describe('UserService', () => {
  let userService: UserService;
  let prismaServiceMock: Partial<PrismaService>;

  beforeEach(async () => {
    // prismaServiceMock = {
    //   user: {
    //     create: jest.fn(),
    //     findUnique: jest.fn(),
    //   },
    // };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      // Arrange
      const createUserDto: CreateUser = {
        email: 'test@email.com',
        password: 'password',
      };
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const createUser: CreateUser = {
        ...createUserDto,
        password: hashedPassword,
      };
      const expectedUser: User = {
        id: '1',
        email: createUser.email,
        password: createUser.password,
        biomertricKey: '',
        createdAt: undefined,
        updatedAt: undefined,
      };
      jest
        .spyOn(prismaServiceMock.user, 'create')
        .mockResolvedValue(expectedUser);

      // Act
      const result = await userService.createUser(createUserDto);

      // Assert
      expect(prismaServiceMock.user.create).toHaveBeenCalledWith({
        data: createUser,
      });
      expect(result).toEqual(expectedUser);
    });

    it('should throw BadRequestException if createUser fails', async () => {
      // Arrange
      const createUserDto: CreateUser = {
        email: 'test@email.com',
        password: 'password',
      };
      jest
        .spyOn(bcrypt, 'hash')
        .mockRejectedValueOnce(new Error('Error hashing password'));

      // Act and Assert
      await expect(userService.createUser(createUserDto)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('should find a user by ID', async () => {
      // Arrange
      const userId = '1';
      const expectedUser: User = {
        id: userId,
        email: 'test@example.com',
        password: 'hashedPassword',
        biomertricKey: '',
        createdAt: undefined,
        updatedAt: undefined,
      };
      jest
        .spyOn(prismaServiceMock.user, 'findUnique')
        .mockResolvedValue(expectedUser);

      // Act
      const result = await userService.findOne(userId);

      // Assert
      expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual(expectedUser);
    });

    it('should throw BadRequestException if findUnique fails', async () => {
      // Arrange
      const userId = '1';
      jest
        .spyOn(prismaServiceMock.user, 'findUnique')
        .mockRejectedValueOnce(new Error('Error finding user'));

      // Act and Assert
      await expect(userService.findOne(userId)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      // Arrange
      const userEmail = 'test@example.com';
      const expectedUser: User = {
        id: '1',
        email: userEmail,
        password: 'hashedPassword',
        biomertricKey: '',
        createdAt: undefined,
        updatedAt: undefined,
      };
      jest
        .spyOn(prismaServiceMock.user, 'findUnique')
        .mockResolvedValue(expectedUser);

      // Act
      const result = await userService.findByEmail(userEmail);

      // Assert
      expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: userEmail },
      });
      expect(result).toEqual(expectedUser);
    });
  });
});
