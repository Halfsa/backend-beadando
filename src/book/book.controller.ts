import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BookService, createBookInput } from './book.service';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}
  @Get('')
  getBooks() {
    return this.bookService.getBooks();
  }
  @Get('/:book')
  getBook(@Param('book') id: string) {
    return this.bookService.getBook(id);
  }
  @Post('')
  createBook(@Body() input: createBookInput) {
    return this.bookService.createBook(input);
  }
  updateBook(id: string, input: createBookInput) {
    return this.bookService.updateBook(id, input);
  }
  @Delete('/:book')
  deleteBook(@Param('book') id: string) {
    return this.bookService.deleteBook(id);
  }
}
