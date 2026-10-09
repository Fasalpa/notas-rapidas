package com.notas.notas_rapidas_api.controller;

import com.notas.notas_rapidas_api.model.Note;
import com.notas.notas_rapidas_api.model.User;
import com.notas.notas_rapidas_api.repository.NoteRepository;
import com.notas.notas_rapidas_api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "https://fasalpa.github.io")
public class NoteController {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    @Autowired
    public NoteController(NoteRepository noteRepository, UserRepository userRepository) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario autenticado no encontrado"));
    }

    // Obtener notas del usuario autenticado
    @GetMapping
    public List<Note> getUserNotes() {
        User currentUser = getAuthenticatedUser();
        return noteRepository.findByUserId(currentUser.getId());
    }

    // Crear nota vinculada al usuario logueado
    @PostMapping
    public Note createNote(@RequestBody Note note) {
        User currentUser = getAuthenticatedUser();
        note.setUser(currentUser);
        return noteRepository.save(note);
    }

    // Eliminar nota verificando propiedad
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNote(@PathVariable Long id) {
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