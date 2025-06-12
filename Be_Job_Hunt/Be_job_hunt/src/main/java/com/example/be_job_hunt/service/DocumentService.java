package com.example.be_job_hunt.service;

import com.example.be_job_hunt.dto.DocumentDto;
import com.example.be_job_hunt.dto.DocumentFileDto;
import com.example.be_job_hunt.exception.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;

@Service
public interface DocumentService {
    List<DocumentDto> getAllDocuments();
    DocumentDto getDocumentById(long id) throws NotFoundException;
    DocumentDto createDocument(DocumentDto documentDto, List<MultipartFile>files) throws GeneralSecurityException, IOException;
//    DocumentDto updateDocument(long id, DocumentDto documentDto) throws NotFoundException;
//    void deleteDocument(long id) throws NotFoundException;
//    List<DocumentDto> getDocumentsBySubjectId(long subjectId);
//    List<DocumentDto> getDocumentsByUserId(long userId);
//    List<DocumentDto> getDocumentsByType(String type);
//    List<DocumentDto> getDocumentsByStatus(String status);
}
