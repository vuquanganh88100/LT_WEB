package com.example.be_job_hunt.controller;

import com.example.be_job_hunt.dto.SubjectDto;
import com.example.be_job_hunt.entity.SubjectEntity;
import com.example.be_job_hunt.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/blog/api/subject")
public class SubjectController {
    @Autowired
    SubjectService subjectService;
    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody SubjectDto subjectDto){
        SubjectEntity subjectEntity=subjectService.saveSubject(subjectDto);
        return ResponseEntity.status(HttpStatus.CREATED).body("created subject successfully");
    }
}
