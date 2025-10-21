package com.librarymindxandria.backend.core;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@NoRepositoryBean
public interface BaseRepository<T, ID> extends JpaRepository<T, ID> {

    @Transactional
    @Modifying
    @Query("UPDATE #{#entityName} e SET e.deletedAt = :deletedAt WHERE e.id = :id")
    void softDeleteById(ID id, LocalDateTime deletedAt);

    @Transactional
    @Modifying
    @Query("UPDATE #{#entityName} e SET e.deletedAt = NULL WHERE e.id = :id")
    void restoreDeletedById(ID id);

    @Query("SELECT e FROM #{#entityName} e WHERE e.deletedAt IS null")
    List<T> findAllNotDeleted();

    @Query("SELECT e FROM #{#entityName} e WHERE e.id = :id AND e.deletedAt IS NULL")
    Optional<T> findByIdNotDeleted(ID id);

}
