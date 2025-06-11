package com.example.be_job_hunt.service.imp;

import com.example.be_job_hunt.dto.SubjectDto;
import com.example.be_job_hunt.entity.SubjectEntity;
import com.example.be_job_hunt.mapper.SubjectMapper;
import com.example.be_job_hunt.repository.DepartmentRepository;
import com.example.be_job_hunt.repository.SubjectRepository;
import com.example.be_job_hunt.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SubjectServiceImpl implements SubjectService {
    @Autowired
    SubjectMapper subjectMapper;
    @Autowired
    SubjectRepository subjectRepository;
    @Autowired
    DepartmentRepository departmentRepository;
    @Override
    public SubjectEntity saveSubject(SubjectDto subjectDto) {
        SubjectEntity subjectEntity=subjectMapper.toEntity(subjectDto);
        subjectEntity.setDepartment(departmentRepository.findById(subjectDto.getDepartmentId()).get());
        subjectRepository.save(subjectEntity);
        return subjectEntity;
    }
}
