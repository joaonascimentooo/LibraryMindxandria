package com.librarymindxandria.backend.core.security.token;

import com.librarymindxandria.backend.core.BaseRepository;
import com.librarymindxandria.backend.models.User;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends BaseRepository<RefreshToken, String> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByUser(User user);
    Optional<RefreshToken> findByUser(User user);
}
