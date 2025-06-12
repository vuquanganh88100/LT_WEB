package com.example.be_job_hunt.service.imp;

import com.example.be_job_hunt.config.googleDrive.GoogleDriveApi;
import com.example.be_job_hunt.dto.Document.DocumentDto;
import com.example.be_job_hunt.dto.Document.DocumentFileDto;
import com.example.be_job_hunt.dto.Document.DocumentFileResponseDto;
import com.example.be_job_hunt.entity.DocumentEntity;
import com.example.be_job_hunt.entity.Status;
import com.example.be_job_hunt.entity.SubjectEntity;
import com.example.be_job_hunt.exception.NotFoundException;
import com.example.be_job_hunt.mapper.DocumentMapper;
import com.example.be_job_hunt.repository.DocumentRepository;
import com.example.be_job_hunt.repository.SubjectRepository;
import com.example.be_job_hunt.repository.UserRepository;
import com.example.be_job_hunt.service.DocumentFileService;
import com.example.be_job_hunt.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DocumentServiceImpl implements DocumentService {
    
    @Autowired
    private DocumentRepository documentRepository;
    
    @Autowired
    private DocumentMapper documentMapper;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private GoogleDriveApi googleDriveApi;
    @Autowired
    private DocumentFileService documentFileService;

    @Override
    public Page<DocumentDto> getAllDocuments(Pageable pageable) {
        Page<DocumentEntity> documentPage = documentRepository.findAll(pageable);
        return documentPage.map(documentMapper::toDto);
    }
    
    @Override
    public List<DocumentDto> getAllDocuments() {
        return documentRepository.findAll()
                .stream()
                .map(documentMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public DocumentDto getDocumentById(long id) throws NotFoundException {
        DocumentEntity documentEntity = documentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Document not found with id: " + id));
        return documentMapper.toDto(documentEntity);
    }

    @Override
    public DocumentDto createDocument(DocumentDto documentDto, List<MultipartFile> files) throws GeneralSecurityException, IOException {
        DocumentEntity documentEntity = documentMapper.toEntity(documentDto);
        documentEntity.setCreatedAt(LocalDateTime.now());
        String folderName=documentEntity.getTitle()+" "+documentEntity.getCreatedAt();
        String folderId= googleDriveApi.createFolder(folderName);
        documentEntity.setFolderId(folderId);
        DocumentEntity savedEntity = documentRepository.save(documentEntity);
        List<DocumentFileDto> documentFileDtos=new ArrayList<>();
        for(MultipartFile file:files){
            DocumentFileDto documentFileDto=new DocumentFileDto();
            documentFileDto.setDocumentId(savedEntity.getId());
            documentFileDto.setMultipartFile(file);
            documentFileDtos.add(documentFileDto);
        }
        for(DocumentFileDto documentFileDto:documentFileDtos){
            documentFileService.uploadFile(documentFileDto,folderId);
        }
        return documentMapper.toDto(savedEntity);
    }

    @Override
    public void updateStatus(int documentId,String status) {
        DocumentEntity documentEntity=documentRepository.findById(Long.valueOf(documentId)).get();
        documentEntity.setStatus(Status.valueOf(status));
        documentRepository.save(documentEntity);

    }


    //    @Override
//    public DocumentDto updateDocument(long id, DocumentDto documentDto) throws NotFoundException {
//        if (!documentRepository.existsById(id)) {
//            throw new NotFoundException("Document not found with id: " + id);
//        }
//
//        DocumentEntity existingDocument = documentRepository.findById(id)
//                .orElseThrow(() -> new NotFoundException("Document not found with id: " + id));
//
//        // Update fields
//        existingDocument.setTitle(documentDto.getTitle());
//        existingDocument.setType(Type.valueOf(documentDto.getType()));
//        existingDocument.setDescription(documentDto.getDescription());
//        existingDocument.setFolderId(documentDto.getFolderId());
//        existingDocument.setStatus(Status.valueOf(documentDto.getStatus()));
//
//        // Update relationships if they have changed
//        if (documentDto.getSubjectId() > 0) {
//            existingDocument.setSubject(subjectRepository.findById((int)documentDto.getSubjectId())
//                    .orElseThrow(() -> new NotFoundException("Subject not found with id: " + documentDto.getSubjectId())));
//        }
//
//        if (documentDto.getUserId() > 0) {
//            existingDocument.setUser(userRepository.findById(documentDto.getUserId())
//                    .orElseThrow(() -> new NotFoundException("User not found with id: " + documentDto.getUserId())));
//        }
//
//        DocumentEntity updatedEntity = documentRepository.save(existingDocument);
//        return documentMapper.toDto(updatedEntity);
//    }
//
//    @Override
//    public void deleteDocument(long id) throws NotFoundException {
//        if (!documentRepository.existsById(id)) {
//            throw new NotFoundException("Document not found with id: " + id);
//        }
//        documentRepository.deleteById(id);
//    }
//
@Override
public List<DocumentDto> getDocumentsBySubjectId(long subjectId) {
    Optional<SubjectEntity> optionalSubject = subjectRepository.findById((int) subjectId);
    SubjectEntity subject = optionalSubject.get();
    List<DocumentEntity> documents = documentRepository.findBySubjectId(subject.getId());

    System.out.println("Tìm thấy " + documents.size() + " tài liệu:");
    for (DocumentEntity doc : documents) {
        System.out.println("Document ID: " + doc.getId() + ", Subject ID: " + doc.getSubject().getId());
    }

    List<DocumentDto> documentDtos = new ArrayList<>();
    for (DocumentEntity doc : documents) {
        if(String.valueOf(doc.getStatus()).equals("approved")){
            documentDtos.add(documentMapper.toDto(doc));

        }
    }

    return documentDtos;
}

//
//    @Override
//    public List<DocumentDto> getDocumentsByUserId(long userId) {
//        return userRepository.findById(userId)
//                .map(user -> documentRepository.findByUser(user))
//                .orElse(List.of())
//                .stream()
//                .map(documentMapper::toDto)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public List<DocumentDto> getDocumentsByType(String type) {
//        try {
//            Type documentType = Type.valueOf(type);
//            return documentRepository.findByType(documentType)
//                    .stream()
//                    .map(documentMapper::toDto)
//                    .collect(Collectors.toList());
//        } catch (IllegalArgumentException e) {
//            return List.of();
//        }
//    }
//
//    @Override
//    public List<DocumentDto> getDocumentsByStatus(String status) {
//        try {
//            Status documentStatus = Status.valueOf(status);
//            return documentRepository.findByStatus(documentStatus)
//                    .stream()
//                    .map(documentMapper::toDto)
//                    .collect(Collectors.toList());
//        } catch (IllegalArgumentException e) {
//            return List.of();
//        }
//    }
}
