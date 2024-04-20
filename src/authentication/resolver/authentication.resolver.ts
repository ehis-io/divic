import { User } from 'src/user/models/user';
import { Login } from '../dto/login.dto';
import { AuthenticationService } from '../services/authentication.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth } from '../models/auth';
import { UseGuards } from '@nestjs/common';
import { GqlJWTAuthGuard } from '../guards/gql.jwt.auth.guard';
import { GetUser } from '../decorator/user.decorator';
import { Challenge } from '../models/biometric';
import { LoginResponse } from '../models/login.response';
import { RegisterBiometric } from '../dto/boimetric.data';
import { BiometricDto } from '../dto/BiometricDto';
import { SuccessResponse } from 'src/utilities/successResponse';

@Resolver()
export class AuthenticationResolver {
  constructor(private readonly authenticationService: AuthenticationService) {}
  @Mutation(() => LoginResponse)
  async logIn(@Args('logIn') login: Login) {
    return await this.authenticationService.loginWithPassword(login);
  }
  @Mutation(() => Challenge)
  @UseGuards(GqlJWTAuthGuard)
  async generateChallenge(@GetUser() user: User) {
    return await this.authenticationService.getChallenge(user);
  }
  @Mutation(() => Challenge)
  @UseGuards(GqlJWTAuthGuard)
  async registerUser(
    @Args('registerBiometric') registerBiometric: RegisterBiometric,
    @GetUser() user: User,
  ) {
    return this.authenticationService.register(user, registerBiometric);
  }

  @Mutation(() => LoginResponse)
  async logInWithBiometric(@Args('biometricDto') biometricDto: BiometricDto) {
    return this.authenticationService.biometricLogin(biometricDto);
  }

  // @Mutation(() => Auth)
  // async passwordlessLogin(@Args('') login): Promise<{}> {
  //   return this.authenticationService.loginWithPassword(login);
  // }
}
