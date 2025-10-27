package com.librarymindxandria.backend.repositories;

import com.librarymindxandria.backend.core.BaseRepository;
import com.librarymindxandria.backend.dtos.genre.GenreStatDTO;
import com.librarymindxandria.backend.models.Book;
import com.librarymindxandria.backend.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends BaseRepository<Book, String> {

    List<Book> findByUser(User user);

    @Query("SELECT b FROM Book b WHERE " +
            "LOWER(b.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(b.shortDescription) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Book> searchBooks(@Param("searchTerm") String searchTerm, Pageable pageable);

    @Query(value = """
                SELECT genre_type AS genre, COUNT(book_id) AS count
                FROM book_genre_types
                GROUP BY genre_type
                ORDER BY count DESC
            """, nativeQuery = true)
    List<GenreStatDTO> countBooksByGenre();
}
