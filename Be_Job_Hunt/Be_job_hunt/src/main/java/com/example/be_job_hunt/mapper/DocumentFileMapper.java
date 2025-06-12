package com.example.be_job_hunt.mapper;

import com.example.be_job_hunt.config.googleDrive.GoogleDriveApi;
import com.example.be_job_hunt.dto.DocumentFileDto;
import com.example.be_job_hunt.dto.DocumentFileResponseDto;
import com.example.be_job_hunt.entity.DocumentEntity;
import com.example.be_job_hunt.entity.DocumentFileEntity;
import com.example.be_job_hunt.repository.DocumentRepository;
import com.google.api.services.drive.model.File;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.security.GeneralSecurityException;

@Component
public class DocumentFileMapper {
    @Autowired
    GoogleDriveApi googleDriveApi;
    @Autowired
    DocumentRepository documentRepository;
    public DocumentFileEntity toEntity(DocumentFileDto dto, String folderId) throws GeneralSecurityException, IOException {
            File driveFile = googleDriveApi.uploadToGoogleDrive(dto.getMultipartFile(), folderId);
            DocumentFileEntity entity = new DocumentFileEntity();
            entity.setFileName(driveFile.getName());
            entity.setMimeType(driveFile.getMimeType());
            entity.setSize(driveFile.getSize());
            entity.setUrl("https://drive.google.com/file/d/" + driveFile.getId() + "/view");
            entity.setDocumentEntity(documentRepository.findById(dto.getDocumentId()).get());
            return entity;
        }
    public DocumentFileResponseDto toDto(DocumentFileEntity entity){
        DocumentFileResponseDto res=new DocumentFileResponseDto();
        res.setDocumentFileId(entity.getId());
        res.setFileName(entity.getFileName());
        res.setDocumentId(entity.getDocumentEntity().getId());
        res.setUrl(entity.getUrl());
        res.setSize(entity.getSize());
        res.setMimeType(entity.getMimeType());
        return res;
    }
}
