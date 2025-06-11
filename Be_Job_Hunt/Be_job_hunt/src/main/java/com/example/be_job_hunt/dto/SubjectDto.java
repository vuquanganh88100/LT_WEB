package com.example.be_job_hunt.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubjectDto {
    private int id;
    private String code ;
    private int credit;
    private String description;
    private String title;
    private int departmentId;
}
