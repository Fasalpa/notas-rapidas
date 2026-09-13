package com.notas.notas_rapidas_api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "notes")

public class Note{
    @Id
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String text;

    private String colorBackground;
    private String mood;

    private Long destruction;
    private String capsule;

    @Column(nullable = false)
    private Long date;

//    public Note(){
//    }
//
//    public Note(UUID id, String title, String text, String colorBackground, String mood, Long destruction, String capsule, Long date){
//        this.id = id;
//        this.title = title;
//        this.text = text;
//        this.colorBackground = colorBackground;
//        this.mood = mood;
//        this.destruction = destruction;
//        this.capsule = capsule;
//        this.date = date;
//    }
//
//    public UUID getId(){
//        return id;
//    }
//    public void setId(UUID id) {
//        this.id = id;
//    }
//
//    public String getTitle(){
//        return title;
//    }
//    public void setTitle(String title){
//        this.title = title;
//    }
//
//    public String getText(){
//        return title;
//    }
//
//    public void setText(String text){
//        this.text= text;
//    }
//
//    public String getColorBackground(){
//        return colorBackground;
//    }
//    public void setColorBackground(String colorBackground){
//        this.colorBackground = colorBackground;
//    }
//    public String getMood(){
//        return mood;
//    }
//    public void setMood(String mood){
//        this.mood = mood;
//    }
//    public Long getDestruction(){
//        return destruction;
//    }
//    public void setDestruction(Long destruction){
//        this.destruction = destruction;
//    }
//    public String getCapsule(){
//        return capsule;
//    }
//    public void setCapsule(String capsule){
//        this.capsule = capsule;
//    }
//    public Long getDate(){
//        return date;
//    }
//    public void setDate(Long date){
//        this.date = date;
//    }
}