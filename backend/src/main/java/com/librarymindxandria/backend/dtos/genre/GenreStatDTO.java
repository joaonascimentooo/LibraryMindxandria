package com.librarymindxandria.backend.dtos.genre;

import com.librarymindxandria.backend.enums.GenreType;

public interface GenreStatDTO {
    GenreType getGenre();
    Long getCount();
}
