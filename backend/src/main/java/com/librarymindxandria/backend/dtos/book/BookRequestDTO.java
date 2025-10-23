package com.librarymindxandria.backend.dtos.book;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookRequestDTO {
    private String name;
    private String shortDescription;
    private String longDescription;
}
