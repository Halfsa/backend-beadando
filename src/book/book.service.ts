import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Book } from './book.model';

export type createBookInput = Omit<Book, 'id'>;
@Injectable()
export class BookService {
  private readonly books: Book[] = [];
  getBooks() {
    return this.books;
  }
  getBook(id: string) {
    const bookNeeded = this.books.find((book) => {
      return book.id === id;
    });
    return bookNeeded;
  }
  createBook(input: createBookInput) {
    const currentYear = new Date().getFullYear();
    if (input.release_date > currentYear || input.release_date === undefined) {
      throw new BadRequestException(
        'Book can not be released in the future and has to have a value',
      );
    }
    let a = this.books.length;
    if (a === 0) {
      a = 1;
    } else {
      a = Number.parseInt(this.books[this.books.length - 1].id) + 1;
    }
    const id = a.toString();
    const x: Book = { id: id, ...input };
    console.log(x);
    this.books.push(x);
    console.log(this.getBooks());
    return x;
  }
  updateBook(id: string, input: createBookInput) {
    const bookToUpdate = this.getBook(id);
    if (bookToUpdate === undefined) {
      throw new NotFoundException();
    }
    const updatedBook = Object.assign(bookToUpdate, input);
    console.log(this.getBooks());
    return updatedBook as Book;
  }
  deleteBook(id: string) {
    let index = -1;
    const deleteThis = this.books.find((book, i) => {
      index = i;
      return book.id === id;
    });
    if (deleteThis === undefined) {
      return;
    } else {
      this.books.splice(index, 1);
    }
  }
}
