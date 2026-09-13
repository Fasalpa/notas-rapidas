package com.notas.notas_rapidas_api.repository;

import com.notas.notas_rapidas_api.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface NoteRepository extends JpaRepository<Note, UUID> {

}
