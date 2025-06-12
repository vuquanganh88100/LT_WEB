package com.example.be_job_hunt.service.imp;

import com.example.be_job_hunt.dto.Document.DocumentFileDto;
import com.example.be_job_hunt.entity.DocumentFileEntity;
import com.example.be_job_hunt.mapper.DocumentFileMapper;
import com.example.be_job_hunt.repository.DocumentFileRepository;
import com.example.be_job_hunt.service.DocumentFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;

@Service
public class DocumentFileServiceImpl implements DocumentFileService {
    @Autowired
    DocumentFileMapper documentFileMapper;
    @Autowired
    DocumentFileRepository documentFileRepository;
    @Override
    public void uploadFile(DocumentFileDto documentFileDto,String folderId) throws GeneralSecurityException, IOException {
        DocumentFileEntity entity = documentFileMapper.toEntity(documentFileDto, folderId);
        documentFileRepository.save(entity);
    }
}
