import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() userData: Partial<User>): Promise<User> {
    return this.usersService.create(userData);
  }

  @Get(':openId')
  async findByOpenId(
    @Param('openId') openId: string,
  ): Promise<User | undefined> {
    return this.usersService.findByOpenId(openId);
  }
}
