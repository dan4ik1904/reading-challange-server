import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthorBookGuard } from 'src/guards/author-book.guard';
import { ApiTags, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('Books')
@Controller('/api/v1/books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ApiOperation({ summary: 'Получение списка всех книг' })
  @ApiOkResponse({ description: 'Успешное получение списка книг' })
  @Get()
  getAll() {
    return this.booksService.getAll()
  }

  @ApiOperation({ summary: 'Получение книги по ID' })
  @ApiOkResponse({ description: 'Успешное получение книги' })
  @Get("/:id")
  getOne(@Param('id') id: string) {
    return this.booksService.getOne(id)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновление книги по ID' })
  @ApiBody({ type: UpdateBookDto })
  @ApiOkResponse({ description: 'Успешное обновление книги' })
  @ApiUnauthorizedResponse({ description: 'Не авторизован' })
  @UseGuards(AuthGuard)
  @UseGuards(AuthorBookGuard)
  @Patch('/:id')
  updateOne(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto, @Headers('Authorization') tgId: string) {
    const tgIdNumber = Number(tgId)
    return this.booksService.updateOne(id, updateBookDto, tgIdNumber)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удаление книги по ID' })
  @ApiOkResponse({ description: 'Успешное удаление книги' })
  @ApiUnauthorizedResponse({ description: 'Не авторизован' })
  @UseGuards(AuthorBookGuard)
  @Delete('/:id')
  deleteOne(@Param('id') id: string) {
    return this.booksService.deleteBook(id)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создание новой книги' })
  @ApiBody({ type: CreateBookDto })
  @ApiCreatedResponse({ description: 'Успешное создание книги' })
  @ApiUnauthorizedResponse({ description: 'Не авторизован' })
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createBookDto: CreateBookDto, @Headers('Authorization') tgId: string) {
    const tgIdNumber = Number(tgId)
    return this.booksService.createBook(createBookDto, tgIdNumber)
  }
}