package com.todo.TODO_JAVA;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Task")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String title;

    private String description; 
    private boolean completed = false ;

    @Column (updatable = false )
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; };
    public String getTitle() { return title;}
    public void setTitle(String title) { this.title = title;}
    public String getDescription() { return description;}
    public void setDescription(String d) { this.description = d;}
    public boolean isCompleted() { return completed;}
    public void setCompleted(boolean c){ this.completed = c;}
    public LocalDateTime getCreatedAt(){ return createdAt;}
}