package com.example.be_job_hunt.dto.Document;

import com.example.be_job_hunt.dto.DepartmentDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DocumentDto {
    private long id;
    private String title;
    private String type;
    private String description;
    private long subjectId;
    private String subjectCode;
    private long userId;
    private String folderId;
    private String status;
    private LocalDateTime createdAt;
    private DepartmentDto departmentDto;
}
