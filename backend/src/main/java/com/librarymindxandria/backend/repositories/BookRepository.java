package com.librarymindxandria.backend.repositories;

import com.librarymindxandria.backend.core.BaseRepository;
import com.librarymindxandria.backend.models.Book;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends BaseRepository<Book, String> {
}
