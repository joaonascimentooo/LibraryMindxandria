package com.librarymindxandria.backend.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookResponseDTO {
    private String id;
    private String name;
    private String shortDescription;
    private String longDescription;
}
