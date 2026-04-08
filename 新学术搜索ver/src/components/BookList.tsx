import React from 'react';
import { BookOpen, Star, ExternalLink } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  year: number;
  isbn: string;
  description: string;
  rating: number;
  category: string;
  tags: string[];
}

interface BookListProps {
  books: Book[];
  onBookClick?: (book: Book) => void;
}

export function BookList({ books, onBookClick }: BookListProps) {
  return (
    <div className="space-y-4">
      {books.map((book) => (
        <div
          key={book.id}
          className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all p-5 cursor-pointer"
          onClick={() => onBookClick?.(book)}
        >
          <div className="flex gap-5">
            {/* Book Cover Placeholder */}
            <div className="w-24 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex items-center justify-center flex-shrink-0 border border-gray-200">
              <BookOpen className="w-10 h-10 text-gray-400" />
            </div>

            {/* Book Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">{book.author}</p>
                  <p className="text-xs text-gray-500">
                    {book.publisher} · {book.year}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-semibold text-gray-900">{book.rating}</span>
                </div>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed mb-3 line-clamp-2">
                {book.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {book.category}
                  </span>
                  {book.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded border border-gray-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-500">ISBN: {book.isbn}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {books.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无图书推荐</h3>
          <p className="text-gray-600">请尝试其他搜索条件</p>
        </div>
      )}
    </div>
  );
}
