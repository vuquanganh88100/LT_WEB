package com.example.be_job_hunt.repository;

import com.example.be_job_hunt.entity.DocumentFileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentFileRepository extends JpaRepository<DocumentFileEntity,Long> {
}
