package com.example.be_job_hunt.service;

import com.example.be_job_hunt.dto.DepartmentDto;
import com.example.be_job_hunt.exception.DuplicateException;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface DepartmentService {
    List<DepartmentDto> getDepartment();
    DepartmentDto saveDepartment(DepartmentDto departmentDto);
    DepartmentDto updateDepartment(int id, DepartmentDto departmentDto) throws DuplicateException;
}
