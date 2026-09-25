package com.notas.notas_rapidas_api.repository;

import com.notas.notas_rapidas_api.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NoteRepository extends JpaRepository<Note, UUID> {

    @Query("SELECT n FROM Note n WHERE n.destruction IS NULL OR n.destruction > :now")
    List<Note> findAllActiveNotes(@Param("now") Long now);

    @Modifying
    @Query("DELETE FROM Note n WHERE n.destruction IS NULL OR n.destruction <= :now")
    int deleteAllExpiredNotes(@Param("now") Long now);
}