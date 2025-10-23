package com.librarymindxandria.backend.controllers;

import com.librarymindxandria.backend.dtos.BookRequestDTO;
import com.librarymindxandria.backend.dtos.BookUpdateRequestDTO;
import com.librarymindxandria.backend.models.BookResponseDTO;
import com.librarymindxandria.backend.services.BookService;
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

    @PostMapping("/upload")
    public ResponseEntity<BookResponseDTO> uploadBook(@RequestBody BookRequestDTO bookRequestDTO){
      return ResponseEntity.ok(bookService.createBook(bookRequestDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookResponseDTO> updateMyBook(
            @PathVariable String id,
            @RequestBody BookUpdateRequestDTO updateRequestDTO){
        return ResponseEntity.ok(bookService.uploadMyBook(id,updateRequestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMyBook(@PathVariable String id){
        bookService.deleteMyBook(id);
        return ResponseEntity.noContent().build();
    }
}
