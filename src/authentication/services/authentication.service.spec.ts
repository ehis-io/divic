import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { UserService } from '../../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../config/prisma.service';
import * as bcrypt from 'bcrypt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let userService: UserService;
  let jwtService: JwtService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        UserService,
        JwtService,
        PrismaService,
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    authenticationService = module.get<AuthenticationService>(
      AuthenticationService,
    );

    // Mock the userService method
    jest
      .spyOn(userService, 'findByEmail')
      .mockImplementation(async (email: string) => {
        if (email === 'user@example.com') {
          return {
            id: '123',
            email: 'user@example.com',
            biomertricKey: '',
            password: await bcrypt.hash('password', 10), // Hash the password
            createdAt: new Date('2023-10-14T22:11:20+0000'),
            updatedAt: new Date('2023-10-14T22:11:20+0000'),
          };
        } else {
          return undefined;
        }
      });

    // Mock the bcrypt.compare method
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

    // Mock the jwtService.sign method
    jest.spyOn(jwtService, 'sign').mockReturnValueOnce('accessToken');
  });

  it('should throw NotFoundException if user is not found', async () => {
    // Act and Assert
    await expect(
      authenticationService.loginWithPassword({
        email: 'notfound@example.com',
        password: 'password',
      }),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should return user data with access token', async () => {
    // Act
    const result: any = await authenticationService.loginWithPassword({
      email: 'user@example.com',
      password: 'password',
    });

    // Assert
    expect(result.accessToken).toEqual('accessToken');
  });

  it('should throw UnauthorizedException if password is incorrect', async () => {
    // Arrange
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

    // Act and Assert
    await expect(
      authenticationService.loginWithPassword({
        email: 'user@example.com',
        password: 'incorrectPassword',
      }),
    ).rejects.toThrowError(UnauthorizedException);
  });
});
