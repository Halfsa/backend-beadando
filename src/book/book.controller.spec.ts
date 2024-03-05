import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService, createBookInput } from './book.service';
import { Book } from './book.model';

describe('BookController', () => {
  let controller: BookController;
  let mockBookService: BookService;

  beforeEach(async () => {
    mockBookService = {} as BookService;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        {
          provide: BookService,
          useValue: mockBookService,
        },
      ],
    }).compile();

    controller = module.get<BookController>(BookController);
  });
  it('should return the list of books (a library?) returned by bookservice.getBooks()', () => {
    mockBookService.getBooks = () => {
      return [{ id: '1', author: 'my mom', title: 'me', release_date: 2005 }];
    };
    const books = controller.getBooks();
    expect(books).toEqual([
      { id: '1', author: 'my mom', title: 'me', release_date: 2005 },
    ]);
  });
  it('should return the single book returned by getBook()', () => {
    mockBookService.getBook = (id: string) => {
      if (id === '98') {
        return { id: '1', author: 'my mom', title: 'me', release_date: 2005 };
      }
      return undefined;
    };
    const book = controller.getBook('98');
    expect(book).toEqual({
      id: '1',
      author: 'my mom',
      title: 'me',
      release_date: 2005,
    });
  });
  it('should return the single book created after createBook()', () => {
    mockBookService.createBook = (input: createBookInput) => {
      return { id: '1', ...input };
    };
    const book = controller.createBook({
      author: 'my mom',
      title: 'me',
      release_date: 2005,
    });
    expect(book).toEqual({
      id: '1',
      author: 'my mom',
      title: 'me',
      release_date: 2005,
    });
  });
  it('should return the updated book after updateBook()', () => {
    mockBookService.createBook = (input: createBookInput) => {
      return { id: '1', ...input };
    };
    mockBookService.updateBook = (id: string, input: createBookInput) => {
      return { id: id, ...input };
    };
    const book = controller.createBook({
      author: 'my mom',
      title: 'me',
      release_date: 2005,
    });
    const updatedBook = controller.updateBook(book.id, {
      author: book.author,
      title: 'ajaja',
      release_date: 2004,
    });
    expect(updatedBook).toEqual({
      id: book.id,
      author: book.author,
      title: 'ajaja',
      release_date: 2004,
    });
  });
  it('should call deleteBook()', () => {
    mockBookService.deleteBook = jest.fn();
    controller.deleteBook('98');
    expect(mockBookService.deleteBook).toHaveBeenCalledWith('98');
  });
});
