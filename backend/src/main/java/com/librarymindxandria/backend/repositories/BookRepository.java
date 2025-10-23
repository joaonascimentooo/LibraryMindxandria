package com.librarymindxandria.backend.repositories;

import com.librarymindxandria.backend.core.BaseRepository;
import com.librarymindxandria.backend.models.Book;
import com.librarymindxandria.backend.models.User;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends BaseRepository<Book, String> {

    List<Book> findByUser(User user);
}
