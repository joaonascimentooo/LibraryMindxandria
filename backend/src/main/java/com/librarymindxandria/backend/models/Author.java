package com.librarymindxandria.backend.models;

import com.librarymindxandria.backend.core.Auditable;
import com.librarymindxandria.backend.enums.GenreType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "authors")
@Getter
@Setter
public class Author extends Auditable {

    private String name;
    private String email;
    @Column(name = "phone_number")
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    private List<GenreType> genreTypes;
}
