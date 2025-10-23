package com.librarymindxandria.backend.services;

import com.librarymindxandria.backend.dtos.BookRequestDTO;
import com.librarymindxandria.backend.dtos.BookUpdateRequestDTO;
import com.librarymindxandria.backend.models.Book;
import com.librarymindxandria.backend.models.BookResponseDTO;
import com.librarymindxandria.backend.models.User;
import com.librarymindxandria.backend.repositories.BookRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;
    private final UserService userService;

    @Transactional
    public List<BookResponseDTO> getMyBooks(){
        User user = userService.getAuthenticatedUserEntity();

        List<Book> userBooks = bookRepository.findByUser(user);

        return userBooks.stream()
                .map(this::mapBookToDTO)
                .toList();
    }

    @Transactional
    public BookResponseDTO createBook(BookRequestDTO requestDTO){

        User user = userService.getAuthenticatedUserEntity();

        Book newBook = new Book();
        newBook.setName(requestDTO.getName());
        newBook.setShortDescription(requestDTO.getShortDescription());
        newBook.setLongDescription(requestDTO.getLongDescription());
        newBook.setCreatedAt(LocalDateTime.now());
        newBook.setUser(user);

        Book savedBook = bookRepository.save(newBook);

        return mapBookToDTO(savedBook);

    }

    @Transactional
    public BookResponseDTO uploadMyBook(String bookId, BookUpdateRequestDTO updateRequestDTO){

        User currentUser = userService.getAuthenticatedUserEntity();

        Book bookToUpdate = bookRepository.findById(bookId).orElseThrow(() -> new RuntimeException("Livro não encontrado"));

        if (!bookToUpdate.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Você não tem permissão para editar este livro.");
        }

        Optional.ofNullable(updateRequestDTO.getName())
                .ifPresent(bookToUpdate::setName);
        Optional.ofNullable(updateRequestDTO.getLongDescription())
                .ifPresent(bookToUpdate::setLongDescription);
        Optional.ofNullable(updateRequestDTO.getShortDescription())
                .ifPresent(bookToUpdate::setShortDescription);

        Book updatedBook = bookRepository.save(bookToUpdate);
        return mapBookToDTO(updatedBook);
    }
    private BookResponseDTO mapBookToDTO(Book book) {
        BookResponseDTO responseDTO = new BookResponseDTO();
        responseDTO.setId(book.getId());
        responseDTO.setName(book.getName());
        responseDTO.setShortDescription(book.getShortDescription());
        responseDTO.setLongDescription(book.getLongDescription());
        return responseDTO;
    }
}
