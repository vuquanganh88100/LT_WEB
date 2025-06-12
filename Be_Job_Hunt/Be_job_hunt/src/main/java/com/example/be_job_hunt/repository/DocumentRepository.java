package com.example.be_job_hunt.repository;

import com.example.be_job_hunt.entity.DocumentEntity;
import com.example.be_job_hunt.entity.Status;
import com.example.be_job_hunt.entity.SubjectEntity;
import com.example.be_job_hunt.entity.Type;
import com.example.be_job_hunt.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<DocumentEntity,Long> {
    @Query("SELECT d FROM DocumentEntity d WHERE d.subject.id = :subjectId")
    List<DocumentEntity> findBySubjectId(@Param("subjectId") Long subjectId);
    List<DocumentEntity> findByUser(UserEntity user);
    List<DocumentEntity> findByType(Type type);
    List<DocumentEntity> findByStatus(Status status);
}
