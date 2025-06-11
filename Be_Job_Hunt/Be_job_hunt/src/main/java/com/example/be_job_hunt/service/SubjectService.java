package com.example.be_job_hunt.service;

import com.example.be_job_hunt.dto.SubjectDto;
import com.example.be_job_hunt.entity.SubjectEntity;
import com.example.be_job_hunt.exception.DuplicateException;
import org.springframework.stereotype.Service;

import javax.security.auth.Subject;
import java.util.List;

@Service
public interface SubjectService {
     SubjectEntity saveSubject(SubjectDto subjectDto);
     List<SubjectDto> getSubjectByDepartment(int departmentId);
     List<SubjectDto>getAllSubject();
     SubjectDto updateSubject(int id, SubjectDto subjectDto) throws DuplicateException;
}
