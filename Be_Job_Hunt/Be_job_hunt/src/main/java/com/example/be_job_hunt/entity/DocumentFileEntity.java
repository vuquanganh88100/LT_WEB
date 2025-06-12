package com.example.be_job_hunt.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "document_file")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentFileEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(name = "file_name", nullable = false, length = 50)
    private String fileName;
    @Column(name = "url", nullable = false, length = 50)
    private String url;
    @Column(name = "mime_type", nullable = false, length = 50)
    private String mimeType;
    @Column(name = "size", nullable = false, length = 50)
    private Long size;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id")
    private DocumentEntity documentEntity;

}
