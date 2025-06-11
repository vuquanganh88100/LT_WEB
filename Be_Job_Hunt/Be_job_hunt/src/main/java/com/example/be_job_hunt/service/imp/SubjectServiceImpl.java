package com.example.be_job_hunt.service.imp;

import com.example.be_job_hunt.dto.SubjectDto;
import com.example.be_job_hunt.entity.DepartmentEntity;
import com.example.be_job_hunt.entity.SubjectEntity;
import com.example.be_job_hunt.exception.DuplicateException;
import com.example.be_job_hunt.mapper.SubjectMapper;
import com.example.be_job_hunt.repository.DepartmentRepository;
import com.example.be_job_hunt.repository.SubjectRepository;
import com.example.be_job_hunt.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.security.auth.Subject;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

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

    @Override
    public List<SubjectDto> getSubjectByDepartment(int departmentId) {
        List<SubjectEntity> subjectEntities = subjectRepository.findByDepartmentId(departmentId);
        List<SubjectDto>subjectDtos=new ArrayList<>();
        for(SubjectEntity sub:subjectEntities){
            SubjectDto subjectDto=subjectMapper.toDto(sub);
            subjectDtos.add(subjectDto);
        }
        return  subjectDtos;
    }

    @Override
    public List<SubjectDto> getAllSubject() {
        List<SubjectEntity> subjectEntities = subjectRepository.findAll();
        List<SubjectDto>subjectDtos=new ArrayList<>();
        for(SubjectEntity sub:subjectEntities){
            SubjectDto subjectDto=subjectMapper.toDto(sub);
            subjectDto.setDepartmentName(departmentRepository.findById(subjectDto.getDepartmentId()).get().getName());
            subjectDto.setSubjectId(sub.getId());
            subjectDtos.add(subjectDto);
        }
        return  subjectDtos;
    }

    @Override
    public SubjectDto updateSubject(int id, SubjectDto subjectDto) throws DuplicateException {
        // 1. Kiểm tra tên môn học có trùng trong cùng khoa (ngoại trừ ID hiện tại)
        List<SubjectEntity> duplicates = subjectRepository.findByCodeAndDepartmentIdExcludingId(
                subjectDto.getCode(),
                subjectDto.getDepartmentId(),
                id
        );
        if (!duplicates.isEmpty()) {
            throw new DuplicateException("Mã code môn học : '" + subjectDto.getCode() +
                    "' đã tồn tại trong khoa có ID: " + subjectDto.getDepartmentId());
        }

        SubjectEntity existingSubject = subjectRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy môn học với ID: " + id));

        DepartmentEntity department = departmentRepository.findById(subjectDto.getDepartmentId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy khoa với ID: " + subjectDto.getDepartmentId()));

        existingSubject.setCode(subjectDto.getCode());
        existingSubject.setTitle(subjectDto.getTitle());
        existingSubject.setCredit(subjectDto.getCredit());
        existingSubject.setDescription(subjectDto.getDescription());
        existingSubject.setDepartment(department);

        SubjectEntity updatedSubject = subjectRepository.save(existingSubject);
        SubjectDto updatedDto = subjectMapper.toDto(updatedSubject);
        updatedDto.setDepartmentName(department.getName());

        return updatedDto;
    }

}
