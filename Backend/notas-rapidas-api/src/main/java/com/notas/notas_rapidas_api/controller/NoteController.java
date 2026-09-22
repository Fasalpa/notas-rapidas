package com.notas.notas_rapidas_api.controller;

import com.notas.notas_rapidas_api.model.Note;
import com.notas.notas_rapidas_api.service.NoteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notes")

public class NoteController {
    private final NoteService noteService;

    public NoteController(NoteService noteService){
        this.noteService = noteService;
    }

    @GetMapping
    public ResponseEntity<List<Note>> getAllNotes(){
        List<Note> notes = noteService.getAllNotes();
        //esta es para retornar el estado 200 con el JSON de las notas
        return ResponseEntity.ok(notes);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Note> getNoteById(@PathVariable UUID id) {
        return noteService.getNoteById(id)
                .map(note -> ResponseEntity.ok(note))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Note> createNote(@RequestBody Note note){
        Note saveNote = noteService.saveNote(note);
        return ResponseEntity.status(HttpStatus.CREATED).body(saveNote);
    }

    @PutMapping
    public ResponseEntity<Note> updateNote(@PathVariable UUID id, @RequestBody Note noteDetails){
        return noteService.getNoteById(id).map(existingNote -> {
            existingNote.setTitle(noteDetails.getTitle());
            existingNote.setText(noteDetails.getText());
            existingNote.setColorBackground(noteDetails.getColorBackground());
            existingNote.setMood(noteDetails.getMood());
            existingNote.setDestruction(noteDetails.getDestruction());
            existingNote.setCapsule(noteDetails.getCapsule());

            Note updateNote = noteService.saveNote(existingNote);
            return ResponseEntity.ok(updateNote);
        }).orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable("id") UUID id){
        if(noteService.getNoteById(id).isPresent()){
            noteService.deleteNote(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

}
