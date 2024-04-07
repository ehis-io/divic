import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { SuccessResponse } from 'src/utilities/successResponse';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { CreateUser } from '../dto/create.user';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}
  /**
   *
   * @param id
   * @returns {user}
   */
  @Query(() => User)
  async getUser(@Args('id') id: string): Promise<User> {
    return await this.userService.findOne(id);
  }
  /**
   *
   * @param createUser
   * @returns {User}
   */
  @Mutation(() => User)
  async createUser(@Args('createUser') createUser: CreateUser): Promise<User> {
    return await this.userService.createUser(createUser);
  }
}
