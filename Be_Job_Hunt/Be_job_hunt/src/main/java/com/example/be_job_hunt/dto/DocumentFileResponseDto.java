package com.example.be_job_hunt.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DocumentFileResponseDto {
    private long documentFileId;
    private long documentId;
    private String fileName;
    private String url;
    private String mimeType;
    private long size;
}
