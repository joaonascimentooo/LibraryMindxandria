package com.librarymindxandria.backend.dtos.book;

import com.librarymindxandria.backend.enums.GenreType;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BookRequestDTO {
    @NotBlank
    private String name;
    @NotBlank
    private String shortDescription;
    private String longDescription;
    private List<GenreType> genreType;
}
