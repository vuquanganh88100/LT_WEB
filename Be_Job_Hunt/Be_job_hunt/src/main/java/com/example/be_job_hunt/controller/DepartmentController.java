package com.example.be_job_hunt.controller;

import com.example.be_job_hunt.dto.DepartmentDto;
import com.example.be_job_hunt.dto.ErrorResponse;
import com.example.be_job_hunt.exception.DuplicateException;
import com.example.be_job_hunt.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Controller
@RequestMapping("/blog/api/department")
public class DepartmentController {
    @Autowired
    DepartmentService departmentService;
    
    @GetMapping
    public ResponseEntity<List<DepartmentDto>> getAllDepartment(){
        return ResponseEntity.status(HttpStatus.OK).body(departmentService.getDepartment());
    }
    
    @PostMapping("/create")
    public ResponseEntity<DepartmentDto>addDepartment(@RequestBody DepartmentDto departmentDto){
        return ResponseEntity.status(HttpStatus.CREATED).body(departmentService.saveDepartment(departmentDto));
    }
    
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateDepartment(@PathVariable("id") int id, @RequestBody DepartmentDto departmentDto) {
        try {
            DepartmentDto updatedDepartment = departmentService.updateDepartment(id, departmentDto);
            return ResponseEntity.status(HttpStatus.OK).body(updatedDepartment);
        } catch (DuplicateException e) {
            ErrorResponse errorResponse = new ErrorResponse(
                e.getMessage(),
                HttpStatus.CONFLICT.value(),
                LocalDateTime.now()
            );
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi cập nhật khoa");
        }
    }
}
