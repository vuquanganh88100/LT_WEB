package com.example.be_job_hunt.controller;

import com.example.be_job_hunt.config.googleDrive.GoogleDriveApi;
import com.example.be_job_hunt.dto.Document.DocumentDto;
import com.example.be_job_hunt.service.DocumentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;

@RestController
@RequestMapping("/blog/api/document")
public class DocumentController {
    @Autowired
    private GoogleDriveApi googleDriveApi;
    
    @Autowired
    private DocumentService documentService;
    
    @GetMapping
    public ResponseEntity<List<DocumentDto>> getAllDocuments() {
        return ResponseEntity.ok(documentService.getAllDocuments());
    }
    
//    @GetMapping
//    public ResponseEntity<DocumentDto> getDocumentBySubject(@PathVariable long id) {
//        try {
//            return ResponseEntity.ok(documentService.getDocumentById(id));
//        } catch (NotFoundException e) {
//            return ResponseEntity.notFound().build();
//        }
//    }

    @PostMapping( consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentDto> createDocument(
            @RequestParam("document") String documentJson,
            @RequestParam(value = "files", required = false) List<MultipartFile> files
    ) throws IOException, GeneralSecurityException {
        ObjectMapper mapper = new ObjectMapper();
        DocumentDto documentDto = mapper.readValue(documentJson, DocumentDto.class);

        return new ResponseEntity<>(documentService.createDocument(documentDto, files), HttpStatus.CREATED);
    }


//    @PutMapping("/{id}")
//    public ResponseEntity<DocumentDto> updateDocument(@PathVariable long id, @RequestBody DocumentDto documentDto) {
//        try {
//            return ResponseEntity.ok(documentService.updateDocument(id, documentDto));
//        } catch (NotFoundException e) {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteDocument(@PathVariable long id) {
//        try {
//            documentService.deleteDocument(id);
//            return ResponseEntity.noContent().build();
//        } catch (NotFoundException e) {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
@GetMapping("/subject")
public ResponseEntity<List<DocumentDto>> getDocumentsBySubjectId(@RequestParam("subjectId") long subjectId) {
    return ResponseEntity.ok(documentService.getDocumentsBySubjectId(subjectId));
}

//
//    @GetMapping("/user/{userId}")
//    public ResponseEntity<List<DocumentDto>> getDocumentsByUserId(@PathVariable long userId) {
//        return ResponseEntity.ok(documentService.getDocumentsByUserId(userId));
//    }
//
//    @GetMapping("/type/{type}")
//    public ResponseEntity<List<DocumentDto>> getDocumentsByType(@PathVariable String type) {
//        return ResponseEntity.ok(documentService.getDocumentsByType(type));
//    }
//
//    @GetMapping("/status/{status}")
//    public ResponseEntity<List<DocumentDto>> getDocumentsByStatus(@PathVariable String status) {
//        return ResponseEntity.ok(documentService.getDocumentsByStatus(status));
//    }
}
