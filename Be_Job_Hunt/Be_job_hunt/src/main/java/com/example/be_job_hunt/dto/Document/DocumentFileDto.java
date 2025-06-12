package com.example.be_job_hunt.dto.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DocumentFileDto {
    private MultipartFile multipartFile;
    private long documentId;
}
