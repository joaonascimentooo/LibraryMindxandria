package com.librarymindxandria.backend.services;

import com.librarymindxandria.backend.dtos.book.BookRequestDTO;
import com.librarymindxandria.backend.dtos.book.BookUpdateRequestDTO;
import com.librarymindxandria.backend.models.Book;
import com.librarymindxandria.backend.models.BookResponseDTO;
import com.librarymindxandria.backend.models.User;
import com.librarymindxandria.backend.repositories.BookRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    public Page<BookResponseDTO> getAllBooks(String searchTerm, Pageable pageable){
        Page<Book> booksPage;

        if (searchTerm == null|| searchTerm.isBlank()){
            booksPage = bookRepository.findAll(pageable);
        }else {
            booksPage = bookRepository.searchBooks(searchTerm,pageable);
        }
        return booksPage.map(this::mapBookToDTO);
    }

    @Transactional
    public BookResponseDTO createBook(BookRequestDTO requestDTO){

        User user = userService.getAuthenticatedUserEntity();

        Book newBook = new Book();
        newBook.setName(requestDTO.getName());
        newBook.setShortDescription(requestDTO.getShortDescription());
        newBook.setLongDescription(requestDTO.getLongDescription());
        newBook.setGenreTypes(requestDTO.getGenreType());
        newBook.setCreatedAt(LocalDateTime.now());
        newBook.setUser(user);

        Book savedBook = bookRepository.save(newBook);

        return mapBookToDTO(savedBook);

    }

    @Transactional
    public BookResponseDTO updateMyBook(String bookId, BookUpdateRequestDTO updateRequestDTO){

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

    @Transactional
    public void deleteMyBook(String bookId){
        User currentUser = userService.getAuthenticatedUserEntity();

        Book bookToDelete = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));

        if (!bookToDelete.getUser().getId().equals(currentUser.getId())){
            throw new AccessDeniedException("Você não tem permissão para deletar este livro");
        }
        bookRepository.delete(bookToDelete);
    }
    private BookResponseDTO mapBookToDTO(Book book) {
        BookResponseDTO responseDTO = new BookResponseDTO();
        responseDTO.setId(book.getId());
        responseDTO.setName(book.getName());
        responseDTO.setShortDescription(book.getShortDescription());
        responseDTO.setLongDescription(book.getLongDescription());
        responseDTO.setGenreType(book.getGenreTypes());
        return responseDTO;
    }
}
