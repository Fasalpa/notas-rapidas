package com.notas.notas_rapidas_api.service;

import com.notas.notas_rapidas_api.model.Note;
import com.notas.notas_rapidas_api.repository.NoteRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        return noteRepository.findAllActiveNotes(System.currentTimeMillis());
    }

    public Optional<Note> getNoteById(UUID id) {
        return noteRepository.findById(id);
    }

    public Note saveNote(Note note) {
        if (note.getDate() == null) {
            note.setDate(System.currentTimeMillis());
        }
        return noteRepository.save(note);
    }

    // Método de actualización para PUT
    public Optional<Note> updateNote(UUID id, Note updatedNote) {
        return noteRepository.findById(id).map(existingNote -> {
            if (updatedNote.getTitle() != null) {
                existingNote.setTitle(updatedNote.getTitle());
            }
            if (updatedNote.getText() != null) {
                existingNote.setText(updatedNote.getText());
            }
            existingNote.setColorBackground(updatedNote.getColorBackground());
            existingNote.setMood(updatedNote.getMood());
            existingNote.setDestruction(updatedNote.getDestruction());
            existingNote.setCapsule(updatedNote.getCapsule());
            return noteRepository.save(existingNote);
        });
    }

    public void deleteNote(UUID id) {
        noteRepository.deleteById(id);
    }

    @Transactional
    @Scheduled(cron = "0 0 3 * * ?") // Ejecuta todos los días a las 3:00 AM
    public void autoDeleteExpiredNotes() {
        Long now = System.currentTimeMillis();
        noteRepository.deleteAllExpiredNotes(now);
    }
}