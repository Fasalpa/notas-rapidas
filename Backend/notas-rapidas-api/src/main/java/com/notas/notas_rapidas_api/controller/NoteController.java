package com.notas.notas_rapidas_api.controller;

import com.notas.notas_rapidas_api.dto.NoteResponse;
import com.notas.notas_rapidas_api.model.Note;
import com.notas.notas_rapidas_api.model.User;
import com.notas.notas_rapidas_api.repository.NoteRepository;
import com.notas.notas_rapidas_api.repository.UserRepository;
import com.notas.notas_rapidas_api.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "https://fasalpa.github.io")
public class NoteController {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final NoteService noteService;

    @Autowired
    public NoteController(NoteRepository noteRepository, UserRepository userRepository, NoteService noteService) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
        this.noteService = noteService;
    }

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario autenticado no encontrado"));
    }

    // Obtener notas del usuario autenticado
    @GetMapping
    public List<NoteResponse> getUserNotes() {
        User currentUser = getAuthenticatedUser();
        return noteRepository.findByUserId(currentUser.getId())
                .stream()
                .map(NoteResponse::from)
                .toList();
    }

    // Crear nota vinculada al usuario logueado
    @PostMapping
    public NoteResponse createNote(@RequestBody Note note) {
        User currentUser = getAuthenticatedUser();
        note.setUser(currentUser);
        return NoteResponse.from(noteService.saveNote(note));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateNote(@PathVariable UUID id, @RequestBody Note updatedNote) {
        User currentUser = getAuthenticatedUser();
        return noteRepository.findById(id).map(existingNote -> {
            if (!existingNote.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("No tienes permiso para editar esta nota.");
            }
            if (updatedNote.getTitle() == null || updatedNote.getText() == null) {
                return ResponseEntity.badRequest().body("El título y el contenido es obligatorio.");
            }

            return noteService.updateNote(id, updatedNote)
                    .<ResponseEntity<?>>map(note -> ResponseEntity.ok(NoteResponse.from(note)))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Eliminar nota verificando propiedad
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNote(@PathVariable UUID id) {
        User currentUser = getAuthenticatedUser();

        return noteRepository.findById(id).map(note -> {
            if (!note.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No tienes permiso para eliminar esta nota.");
            }
            noteRepository.delete(note);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}