package com.example.be_job_hunt.service.imp;

import com.example.be_job_hunt.dto.DepartmentDto;
import com.example.be_job_hunt.entity.DepartmentEntity;
import com.example.be_job_hunt.repository.DepartmentRepository;
import com.example.be_job_hunt.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service
public class DepartmentServiceImpl implements DepartmentService {
    @Autowired
    DepartmentRepository departmentRepository;
    @Override
    public List<DepartmentDto> getDepartment() {
        List<DepartmentEntity>departmentEntities=departmentRepository.findAll();
        List<DepartmentDto>departmentDtos=new ArrayList<>();
        for(DepartmentEntity departmentEntity:departmentEntities){
            DepartmentDto departmentDto =new DepartmentDto();
            departmentDto.setDepartmentId(departmentEntity.getDepartment_id());
            departmentDto.setName(departmentEntity.getName());
            departmentDtos.add(departmentDto);
        }
        return  departmentDtos;

    }
}
