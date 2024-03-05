import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BookService', () => {
  let service: BookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookService],
    }).compile();

    service = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('read', () => {
    it('should be empty by default', () => {
      expect(service.getBooks()).toEqual([]);
    });
    it('should return a singular book after creating one :)', () => {
      const booksies = service.createBook({
        title: 'Battle Royale',
        author: 'Moody Woody',
        release_date: 2020,
      });
      const bops = service.getBook(booksies.id);
      expect(bops).toEqual({
        id: expect.any(String),
        title: 'Battle Royale',
        author: 'Moody Woody',
        release_date: 2020,
      });
    });
    it('should return undefined if book cannot be find after getBook', () => {
      const biblibobli = service.getBook('42');
      expect(biblibobli).toBeUndefined();
    });
  });
  describe('create', () => {
    it('should return a single book after create', () => {
      service.createBook({
        title: 'hellfire',
        author: 'Wobbly Bobbly',
        release_date: 2020,
      });
      expect(service.getBooks()).toEqual([
        {
          id: expect.any(String),
          title: 'hellfire',
          author: 'Wobbly Bobbly',
          release_date: 2020,
        },
      ]);
    });
    it('should return two books after create', () => {
      service.createBook({
        title: 'Yoo hoo!',
        author: 'Big summer Blowout',
        release_date: 1156,
      });
      service.createBook({
        title: 'hellfire',
        author: 'Wobbly Bobbly',
        release_date: 2024,
      });
      expect(service.getBooks()).toEqual([
        {
          id: expect.any(String),
          title: 'Yoo hoo!',
          author: 'Big summer Blowout',
          release_date: 1156,
        },
        {
          id: expect.any(String),
          title: 'hellfire',
          author: 'Wobbly Bobbly',
          release_date: 2024,
        },
      ]);
    });
    it('should throw a bad request exception if the year of release is invalid', () => {
      const currentYear = new Date().getFullYear();
      expect(() => {
        service.createBook({
          title: 'hellfire',
          author: 'Wobbly Bobbly',
          release_date: currentYear + 1,
        });
      }).toThrow(BadRequestException);
    });
  });
  describe('update', () => {
    it('should update the value of a single book after update', () => {
      const createdBook = service.createBook({
        title: 'shit',
        author: 'a shitty man',
        release_date: 1010,
      });
      service.updateBook(createdBook.id, {
        title: 'xaxaxaxa',
        author: createdBook.author,
        release_date: createdBook.release_date,
      });
      expect(service.getBook(createdBook.id)!.title).toEqual('xaxaxaxa');
    });
    it('should throw a notfound exception if book is not found', () => {
      expect(() => {
        service.updateBook('1', { author: '', release_date: 2, title: '' });
      }).toThrow(NotFoundException);
    });
    it('should return the updated book', () => {
      const createdTodo = service.createBook({
        author: 'dsvmklvkdsj',
        title: 'lsdjkabdvkjsvbakjvdbs',
        release_date: 1,
      });
      expect(
        service.updateBook(createdTodo.id, {
          author: createdTodo.author,
          title: 'waaa',
          release_date: 12,
        }),
      ).toEqual({
        id: expect.any(String),
        author: createdTodo.author,
        title: 'waaa',
        release_date: 12,
      });
    });
  });
  describe('delete', () => {
    it('should delete the book with the given id from the list', () => {
      service.createBook({
        author: 'xxxx',
        release_date: 30,
        title: 'YOO HOO, BIG SUMMER BLOWOUT',
      });
      const deleteThis = service.createBook({
        author: 'yyyy',
        release_date: 30,
        title: 'YOO HOO, BIG WINTER BLOWOUT',
      });
      service.createBook({
        author: 'djkkjvdbsjbhv',
        release_date: 31,
        title: 'YOO HOO, BIG AUTUMN BLOWOUT',
      });
      service.deleteBook(deleteThis.id);
      expect(service.getBooks()).toEqual([
        {
          id: '1',
          author: 'xxxx',
          release_date: 30,
          title: 'YOO HOO, BIG SUMMER BLOWOUT',
        },
        {
          id: '3',
          author: 'djkkjvdbsjbhv',
          release_date: 31,
          title: 'YOO HOO, BIG AUTUMN BLOWOUT',
        },
      ]);
    });
    it('should not delete anything if we give a bad id', () => {
      service.createBook({
        author: 'xxxx',
        release_date: 30,
        title: 'YOO HOO, BIG SUMMER BLOWOUT',
      });
      service.createBook({
        author: 'djkkjvdbsjbhv',
        release_date: 31,
        title: 'YOO HOO, BIG AUTUMN BLOWOUT',
      });
      service.deleteBook('0');
      expect(service.getBooks()).toEqual([
        {
          id: '1',
          author: 'xxxx',
          release_date: 30,
          title: 'YOO HOO, BIG SUMMER BLOWOUT',
        },
        {
          id: '2',
          author: 'djkkjvdbsjbhv',
          release_date: 31,
          title: 'YOO HOO, BIG AUTUMN BLOWOUT',
        },
      ]);
    });
  });
});
