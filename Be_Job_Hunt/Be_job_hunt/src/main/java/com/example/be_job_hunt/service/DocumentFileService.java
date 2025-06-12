package com.example.be_job_hunt.service;

import com.example.be_job_hunt.dto.DocumentFileDto;
import com.example.be_job_hunt.dto.DocumentFileResponseDto;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;

@Service
public interface DocumentFileService {
    void uploadFile(DocumentFileDto documentFileDto,String folderId) throws GeneralSecurityException, IOException;
}
