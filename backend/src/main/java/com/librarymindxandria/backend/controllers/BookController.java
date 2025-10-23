package com.librarymindxandria.backend.controllers;

import com.librarymindxandria.backend.dtos.book.BookRequestDTO;
import com.librarymindxandria.backend.dtos.book.BookUpdateRequestDTO;
import com.librarymindxandria.backend.models.BookResponseDTO;
import com.librarymindxandria.backend.services.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/all")
    public ResponseEntity<List<BookResponseDTO>> getAllBooks(){
        List<BookResponseDTO> allBooks = bookService.getAllBooks();
        return ResponseEntity.ok(allBooks);
    }

    @PostMapping("/upload")
    public ResponseEntity<BookResponseDTO> uploadBook(@RequestBody @Valid BookRequestDTO bookRequestDTO){
      return ResponseEntity.ok(bookService.createBook(bookRequestDTO));
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
