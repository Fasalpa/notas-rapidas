package com.notas.notas_rapidas_api.service;

import com.notas.notas_rapidas_api.model.Note;
import com.notas.notas_rapidas_api.repository.NoteRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class NoteService {

    private final NoteRepository noteRepository;

    public NoteService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    public List<Note> getAllNotes() {
        return noteRepository.findAllActiveNotes(System.currentTimeMillis());
    }

    // Cambiado UUID por Long
    public Optional<Note> getNoteById(Long id) {
        return noteRepository.findById(id);
    }

    public Note saveNote(Note note) {
        // En Long no se asigna UUID.randomUUID(), la BD se encarga de asignar el ID autoincrementable.
        if (note.getDate() == null) {
            note.setDate(System.currentTimeMillis());
        }
        return noteRepository.save(note);
    }

    // Método de actualización para PUT (Cambiado UUID por Long)
    public Optional<Note> updateNote(Long id, Note updatedNote) {
        return noteRepository.findById(id).map(existingNote -> {
            if (updatedNote.getTitle() != null) {
                existingNote.setTitle(updatedNote.getTitle());
            }
            if (updatedNote.getText() != null) {
                existingNote.setText(updatedNote.getText());
            }
            if (updatedNote.getColorBackground() != null) {
                existingNote.setColorBackground(updatedNote.getColorBackground());
            }
            if (updatedNote.getMood() != null) {
                existingNote.setMood(updatedNote.getMood());
            }
            if (updatedNote.getDestruction() != null) {
                existingNote.setDestruction(updatedNote.getDestruction());
            }
            if (updatedNote.getCapsule() != null) {
                existingNote.setCapsule(updatedNote.getCapsule());
            }
            return noteRepository.save(existingNote);
        });
    }

    // Cambiado UUID por Long
    public void deleteNote(Long id) {
        noteRepository.deleteById(id);
    }

    @Transactional
    @Scheduled(cron = "0 0 3 * * ?") // Ejecuta todos los días a las 3:00 AM
    public void autoDeleteExpiredNotes() {
        Long now = System.currentTimeMillis();
        noteRepository.deleteAllExpiredNotes(now);
    }
}