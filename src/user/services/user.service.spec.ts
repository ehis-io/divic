import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../config/prisma.service';
import { CreateUser } from '../dto/create.user';
import { User } from '../models/user';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  const prismaServiceMock = {
    user: {
      create: jest.fn().mockImplementation((dto) =>
        Promise.resolve({
          id: Date.now().toString(),
          ...dto,
          createdAt: Date.now(),
          UpdateAt: Date.now(),
        }),
      ),

      findUnique: jest.fn().mockImplementation(() => {}),
    },
  };

  let userService: UserService;

  beforeEach(async () => {
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

  describe('createUser', () => {
    it('should create a user', async () => {
      // Arrange
      const createUserDto: CreateUser = {
        email: 'test@email.com',
        password: 'password',
      };
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      createUserDto.password = hashedPassword;

      // Act
      const result = await userService.createUser(createUserDto);
      // const createSpy = jest
      //   .spyOn(prismaServiceMock.user, 'create')
      //   .mockResolvedValue(createUserDto as User);

      // Assert
      expect(prismaServiceMock.user.create).toHaveBeenCalled();

      expect(prismaServiceMock.user.create).toHaveBeenCalledWith({
        data: createUserDto,
      });
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
        biometricKey: '',
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
        biometricKey: '',
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
