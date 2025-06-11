package com.example.be_job_hunt.service;

import com.example.be_job_hunt.dto.SubjectDto;
import com.example.be_job_hunt.entity.SubjectEntity;
import org.springframework.stereotype.Service;

import javax.security.auth.Subject;

@Service
public interface SubjectService {
     SubjectEntity saveSubject(SubjectDto subjectDto);
}
