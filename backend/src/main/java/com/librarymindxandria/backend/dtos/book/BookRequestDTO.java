package com.librarymindxandria.backend.dtos.book;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookRequestDTO {
    @NotBlank
    private String name;
    @NotBlank
    private String shortDescription;
    private String longDescription;
}
