package com.example.be_job_hunt.controller;

import com.example.be_job_hunt.dto.Document.DocumentDto;
import com.example.be_job_hunt.dto.ErrorResponse;
import com.example.be_job_hunt.dto.SubjectDto;
import com.example.be_job_hunt.entity.SubjectEntity;
import com.example.be_job_hunt.exception.DuplicateException;
import com.example.be_job_hunt.service.DocumentService;
import com.example.be_job_hunt.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

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
    
    @GetMapping("/{departmentId}")
    public ResponseEntity<List<SubjectDto>>getSubjectByDepartment(@PathVariable("departmentId") int departmentId){
        return ResponseEntity.status(HttpStatus.OK).body(subjectService.getSubjectByDepartment(departmentId));
    }
    
    @GetMapping()
    public ResponseEntity<List<SubjectDto>>getAllSubject(){
        return ResponseEntity.status(HttpStatus.OK).body(subjectService.getAllSubject());
    }
    
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateSubject(@PathVariable("id") int id, @RequestBody SubjectDto subjectDto) {
        try {
            SubjectDto updatedSubject = subjectService.updateSubject(id, subjectDto);
            return ResponseEntity.status(HttpStatus.OK).body(updatedSubject);
        } catch (DuplicateException e) {
            ErrorResponse errorResponse = new ErrorResponse(
                e.getMessage(),
                HttpStatus.CONFLICT.value(),
                LocalDateTime.now()
            );
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi cập nhật môn học");
        }
    }

}
