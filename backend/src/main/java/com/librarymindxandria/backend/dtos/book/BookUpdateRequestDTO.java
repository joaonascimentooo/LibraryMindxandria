package com.librarymindxandria.backend.dtos.book;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookUpdateRequestDTO {
    private String name;
    private String author;
    private String shortDescription;
    private String longDescription;
}
