package com.librarymindxandria.backend.models;

import com.librarymindxandria.backend.enums.GenreType;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BookResponseDTO {
    private String id;
    private String name;
    private String shortDescription;
    private String longDescription;
    private List<GenreType> genreType;
}
