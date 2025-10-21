package com.librarymindxandria.backend.models;

import com.librarymindxandria.backend.core.Auditable;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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
}
