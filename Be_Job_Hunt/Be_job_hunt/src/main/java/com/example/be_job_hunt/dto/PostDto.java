package com.example.be_job_hunt.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostDto {
    private long postId;
    private String title;
    private String content;
    private long authorId;
    private String authorName;
    private String status;
    private LocalDateTime createdAt;
}
