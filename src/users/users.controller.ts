import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOkResponse, ApiOperation, ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';

@ApiTags('Users')
@Controller('/api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Получение списка всех пользователей' })
  @ApiOkResponse({ description: 'Успешное получение списка пользователей' })
  @Get()
  findAll() {
    return this.usersService.findAll()
  }

  @ApiOperation({ summary: 'Получение списка топ пользователей' })
  @ApiOkResponse({ description: 'Успешное получение списка топ пользователей' })
  @Get('/top')
  getTop() {
    return this.usersService.getTop()
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение списка одноклассников' })
  @ApiOkResponse({ description: 'Успешное получение списка одноклассников' })
  @ApiUnauthorizedResponse({ description: 'Не авторизован' })
  @UseGuards(AuthGuard)
  @Get('/classmates')
  getClassmates(@Headers('Authorization') tgId: string) {
    const tgIdNumber = Number(tgId);
    return this.usersService.getClassmates(tgIdNumber);
  }
}