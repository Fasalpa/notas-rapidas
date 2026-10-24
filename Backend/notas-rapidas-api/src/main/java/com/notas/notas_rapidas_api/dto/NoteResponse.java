package com.notas.notas_rapidas_api.dto;

import com.notas.notas_rapidas_api.model.Note;

import java.util.UUID;

public record NoteResponse(
        UUID id,
        String title,
        String text,
        String colorBackground,
        String mood,
        Long destruction,
        String capsule,
        Long date
) {
    public static NoteResponse from(Note note) {
        return new NoteResponse(
                note.getId(),
                note.getTitle(),
                note.getText(),
                note.getColorBackground(),
                note.getMood(),
                note.getDestruction(),
                note.getCapsule(),
                note.getDate()
        );
    }
}
