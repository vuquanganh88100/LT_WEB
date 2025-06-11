package com.example.be_job_hunt.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubjectDto {
    private long subjectId;
    private String code ;
    private int credit;
    private String description;
    private String title;
    private int departmentId;
    private String departmentName;
}
