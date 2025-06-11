package com.example.be_job_hunt.controller;

import com.example.be_job_hunt.dto.DepartmentDto;
import com.example.be_job_hunt.dto.SubjectDto;
import com.example.be_job_hunt.entity.SubjectEntity;
import com.example.be_job_hunt.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/blog/api/department")
public class DepartmentController {
    @Autowired
    DepartmentService departmentService;
    @GetMapping
    public ResponseEntity<List<DepartmentDto>> getAllDepartment(){
        return ResponseEntity.status(HttpStatus.CREATED).body(departmentService.getDepartment());
    }
}
