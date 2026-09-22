package com.notas.notas_rapidas_api.repository;

import com.notas.notas_rapidas_api.model.Note;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.UUID;

@Repository
public interface NoteRepository extends JpaRepository<Note, UUID> {

    @Transactional
    @Modifying
    @Query("DELETE FROM Note n WHERE n.destruction IS NOT NULL AND n.destruction <= :currentTime")
    void deleteExpiredNotes(Long currentTime);
}
