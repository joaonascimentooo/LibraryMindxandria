package com.librarymindxandria.backend.repositories;

import com.librarymindxandria.backend.core.BaseRepository;
import com.librarymindxandria.backend.models.User;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends BaseRepository<User, String> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
}
