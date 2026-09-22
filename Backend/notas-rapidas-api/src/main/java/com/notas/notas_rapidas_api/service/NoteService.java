package com.notas.notas_rapidas_api.service;

import com.notas.notas_rapidas_api.model.Note;
import com.notas.notas_rapidas_api.repository.NoteRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class NoteService {

    private final NoteRepository noteRepository;

    public NoteService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    public List<Note> getAllNotes() {
        return noteRepository.findAll();
    }

    public Optional<Note> getNoteById(UUID id) {
        return noteRepository.findById(id);
    }

    public Note saveNote(Note note) {
        if (note.getId() == null) {
            note.setId(UUID.randomUUID());
        }
        if (note.getDate() == null) {
            note.setDate(System.currentTimeMillis());
        }
        return noteRepository.save(note);
    }
    public void deleteNote(UUID id) {
        noteRepository.deleteById(id);
    }

    @Scheduled(fixedRate = 5000)
    public void autoDeleteExpiredNotes() {
        Long currentTime = System.currentTimeMillis();
        noteRepository.deleteExpiredNotes(currentTime);
    }
}