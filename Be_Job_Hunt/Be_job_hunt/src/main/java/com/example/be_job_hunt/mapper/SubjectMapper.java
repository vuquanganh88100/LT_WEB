package com.example.be_job_hunt.mapper;

import com.example.be_job_hunt.dto.SubjectDto;
import com.example.be_job_hunt.entity.SubjectEntity;
import org.springframework.stereotype.Component;

@Component
public class SubjectMapper {
    public SubjectEntity toEntity(SubjectDto dto){
        SubjectEntity subjectEntity=new SubjectEntity();
        subjectEntity.setCode(dto.getCode());
        subjectEntity.setTitle(dto.getTitle());
        subjectEntity.setCredit(dto.getCredit());
        subjectEntity.setDescription(dto.getDescription());
        return  subjectEntity;
    }
}
