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
    public SubjectDto toDto(SubjectEntity entity){
        SubjectDto subjectDto=new SubjectDto();
        subjectDto.setCode(entity.getCode());
        subjectDto.setTitle(entity.getTitle());
        subjectDto.setCredit(entity.getCredit());
        subjectDto.setDescription(entity.getDescription());
        subjectDto.setDepartmentId(entity.getDepartment().getDepartment_id());
        return  subjectDto;
    }
}
