const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage ? true : false;
  
    // Validasi properti 'name'
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    // Validasi properti 'readPage' > pageCount
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const newBook = {
        id, name, year, author,summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
      };

    books.push(newBook);
  
    const isSuccess = books.filter((book) => book.id === id).length > 0;
    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }
  
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
  };

  const getAllBooksHandler = (request, h) => {

    const { name, reading, finished } = request.query; // Ambil parameter query "name"
    
    let filteredBooks = books; // Default: semua buku

    if (name) {
        const lowerCaseName = name.toLowerCase(); // Konversi query ke huruf kecil
        filteredBooks = books.filter((book) => 
            book.name.toLowerCase().includes(lowerCaseName) // Cocokkan nama buku secara non-case sensitive
        );
    }

    // Filter berdasarkan query "reading" (0 atau 1)
    if (reading !== undefined) {
        const isReading = reading === '1'; // Konversi 1 -> true, 0 -> false
        filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
    }

    // Filter berdasarkan query "finished" (0 atau 1)
    if (finished !== undefined) {
        const isFinished = finished === '1'; // Konversi 1 -> true, 0 -> false
        filteredBooks = filteredBooks.filter((book) => book.finished === isFinished);
    }

    if(!name && !reading && !finished) {
        const response = h.response({
            status: "success",
            data: {
                books: filteredBooks.map((book) => ({
                    id: book.id, name: book.name, publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }

    const booksSummary = filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
    }));

    const response = h.response({
        status: "success",
        data: {
            books: booksSummary,
        },
    });
    response.code(200);
    return response;
};

  const getBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const book = books.filter((n) => n.id === id)[0];

    if (book !== undefined) {
        const response = h.response({
            status: 'success',
            data: {
                book,
            },
        });
        response.code(200);
        return response;
    }else{
        const response = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        });
        response.code(404);
        return response;
    }
    
    
   
  };

  const editBookByIdHandler = (request, h) => {
    const { id } = request.params;
  
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();
  
    const finished = pageCount === readPage;
    const index = books.findIndex((book) => book.id === id)[0];

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }
    console.log(index);
    if (index !== -1 && index !== undefined) {
        books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished,
        updatedAt,
      };
  
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
    }else{
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        });
        response.code(404);
        return response;
    }
  
    
  };

  const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;
  
    const index = books.findIndex((book) => book.id === id);
  
    if (index !== -1) {
        books.splice(index, 1);
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      });
      response.code(200);
      return response;
    }
  
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  };

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };