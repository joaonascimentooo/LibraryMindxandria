package com.librarymindxandria.backend.models;

import com.librarymindxandria.backend.core.Auditable;
import com.librarymindxandria.backend.enums.GenreType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "books")
@Getter
@Setter
public class Book extends Auditable {

    private String name;

    @Column(name = "short_description", length = 500)
    private String shortDescription;

    @Column(name = "long_description", length = 3000)
    private String longDescription;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private List<GenreType> genreTypes;

    @Column(name = "cover_image_name")
    private String coverImageName;
}
