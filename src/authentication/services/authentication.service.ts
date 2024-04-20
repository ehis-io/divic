import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../config/prisma.service';
import * as bcrypt from 'bcrypt';
import { Login } from '../dto/login.dto';
import { UserService } from '../../user/services/user.service';

import { User } from 'src/user/models/user';

import { generateChallenge } from '../../utilities/utils';
import { Challenge } from '../dto/challenge';
import { SuccessResponse } from '../../utilities/successResponse';
import { ConfigService } from '@nestjs/config';
import { RegisterBiometric } from '../dto/boimetric.data';
import * as crypto from 'crypto';
import { BiometricDto } from '../dto/BiometricDto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private prismaService: PrismaService,
    private configService: ConfigService,

    private jwtService: JwtService,
  ) {}

  logger = new Logger(AuthenticationService.name);

  /**
   *
   * @param loginDto
   * @returns {User}
   */
  async loginWithPassword(loginDto: Login) {
    const user = await this.userService.findByEmail(loginDto.email);
    const token = await this.generateToken(user);
    const { password, ...result } = user;
    return { ...result, ...token };
  }

  async validateUser(loginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (user && isPasswordValid) {
      return user;
    }

    return null;
  }

  //Biometric Authentication

  async getChallenge(user: User) {
    try {
      const nonce = generateChallenge();

      const challenge: Challenge = { challenge: nonce, userId: user.id };

      return await this.prismaService.challenge.create({
        data: challenge,
      });

      // return 'user';
    } catch (error) {
      this.logger.log(error);
      throw new BadRequestException();
    }
  }

  async register(user: User, registerBiometric: RegisterBiometric) {
    try {
      const challengePayload = await this.prismaService.challenge.findUnique({
        where: { challenge: registerBiometric.challenge },
      });

      if (!challengePayload) {
        return new NotFoundException();
      }

      await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          biometricKey: registerBiometric.publicKey,
        },
      });
      const result: Challenge = {
        challenge: challengePayload.challenge,
        userId: user.id,
      };
      return result;
    } catch (error) {
      this.logger.log(error.message);
      throw new BadRequestException();
    }
  }
  /**
   *
   * @param challenge
   * @param email
   * @returns {LoginResponse}
   */
  async biometricLogin(biometricDto: BiometricDto) {
    try {
      const user = await this.userService.findByEmail(biometricDto.email);
      if (!user) {
        return new BadRequestException('Invalid User');
      }
      const verifySignature = this.verifyKey(
        user.biometricKey,
        biometricDto.challenge,
        biometricDto.signedChallenge,
      );
      if (verifySignature == true) {
        const token = await this.generateToken(user);
        const { password, ...result } = user;
        return { ...result, ...token };
      }
      return new BadRequestException('invalid credential');
    } catch (error) {
      this.logger.log(error);
      throw new BadRequestException('Failed to login. Please try again later');
    }
  }

  verifyKey(publicKey: string, message: string, signature) {
    try {
      const verifier = crypto.createVerify('sha256');
      verifier.update(message);

      const isVerified = verifier.verify(publicKey, signature, 'hex');
      return isVerified;
    } catch (error) {
      this.logger.log('Error verifying message:', error);
      return false;
    }
  }

  /**
   *
   * @param user
   * @returns {Object}
   */
  public async generateToken(user: User) {
    const payload: {} = { sub: user.id, username: user.email };
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign({ payload, accessToken });

    return { accessToken, refreshToken };
  }
}
