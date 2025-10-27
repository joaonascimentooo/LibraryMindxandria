package com.librarymindxandria.backend.controllers;

import com.librarymindxandria.backend.dtos.book.BookRequestDTO;
import com.librarymindxandria.backend.dtos.book.BookUpdateRequestDTO;
import com.librarymindxandria.backend.dtos.book.BookResponseDTO;
import com.librarymindxandria.backend.dtos.genre.GenreStatDTO;
import com.librarymindxandria.backend.services.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {
    private final BookService bookService;

    @GetMapping
    public ResponseEntity<List<BookResponseDTO>> getMyBooks(){
        List<BookResponseDTO> myBooks = bookService.getMyBooks();
        return ResponseEntity.ok(myBooks);
    }

    @GetMapping("/stats")
    public ResponseEntity<List<GenreStatDTO>> getGenreStats(){
        List<GenreStatDTO> stats = bookService.getGenreStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/all")
    public ResponseEntity<Page<BookResponseDTO>> getAllBooks(
            @RequestParam(required = false) String search,
            Pageable pageable) {

        Page<BookResponseDTO> bookPage = bookService.getAllBooks(search, pageable);
        return ResponseEntity.ok(bookPage);
    }

    @PostMapping("/upload")
    public ResponseEntity<BookResponseDTO> uploadBook(@RequestBody @Valid BookRequestDTO bookRequestDTO){
      return ResponseEntity.ok(bookService.createBook(bookRequestDTO));
    }

    @PostMapping("/{id}/cover")
    public ResponseEntity<BookResponseDTO> uploadCover(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) {

        BookResponseDTO updatedBook = bookService.uploadBookCover(id, file);
        return ResponseEntity.ok(updatedBook);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookResponseDTO> updateMyBook(
            @PathVariable String id,
            @RequestBody BookUpdateRequestDTO updateRequestDTO){
        return ResponseEntity.ok(bookService.updateMyBook(id,updateRequestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMyBook(@PathVariable String id){
        bookService.deleteMyBook(id);
        return ResponseEntity.noContent().build();
    }
}
