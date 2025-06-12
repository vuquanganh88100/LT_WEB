package com.example.be_job_hunt.mapper;

import com.example.be_job_hunt.dto.DepartmentDto;
import com.example.be_job_hunt.dto.Document.DocumentDto;
import com.example.be_job_hunt.entity.DepartmentEntity;
import com.example.be_job_hunt.entity.DocumentEntity;
import com.example.be_job_hunt.entity.Status;
import com.example.be_job_hunt.entity.Type;
import com.example.be_job_hunt.repository.DepartmentRepository;
import com.example.be_job_hunt.repository.DocumentRepository;
import com.example.be_job_hunt.repository.SubjectRepository;
import com.example.be_job_hunt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DocumentMapper {
    @Autowired
    SubjectRepository subjectRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    DepartmentRepository departmentRepository;


    public DocumentEntity toEntity(DocumentDto documentDto){
        DocumentEntity documentEntity = new DocumentEntity();
        documentEntity.setTitle(documentDto.getTitle());
        documentEntity.setType(Type.valueOf(documentDto.getType()));
        documentEntity.setDescription(documentDto.getDescription());
        documentEntity.setSubject(subjectRepository.findById((int) documentDto.getSubjectId()).get());
        documentEntity.setUser(userRepository.findById(documentDto.getUserId()).get());
//        documentEntity.setFolderId(documentDto.getFolderId());
        documentEntity.setStatus(Status.valueOf(documentDto.getStatus()));
        return  documentEntity;
    }
    public DocumentDto toDto(DocumentEntity entity){
        DocumentDto documentDto=new DocumentDto();
        documentDto.setId(entity.getId());
        documentDto.setTitle(entity.getTitle());
        documentDto.setType(entity.getType().name());
        documentDto.setDescription(entity.getDescription());
        documentDto.setSubjectId(entity.getSubject().getId());
        documentDto.setUserId(entity.getUser().getId());
        documentDto.setFolderId(entity.getFolderId());
        documentDto.setStatus(entity.getStatus().name());
        documentDto.setCreatedAt(entity.getCreatedAt());
        DepartmentEntity department=departmentRepository.findDepartmentBySubjectId(entity.getSubject().getId());
        DepartmentDto departmentDto=new DepartmentDto();
        departmentDto.setDepartmentId(department.getDepartment_id());
        departmentDto.setName(department.getName());
        documentDto.setDepartmentDto(departmentDto);
        documentDto.setSubjectCode(subjectRepository.findById((int) documentDto.getSubjectId()).get().getCode());
        return  documentDto;
    }
}
