package com.example.be_job_hunt.repository;

import com.example.be_job_hunt.entity.CommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Long> {
    List<CommentEntity> findByPostEntityPostIdOrderByCreatedAtDesc(long postId);
    List<CommentEntity> findByUserIdOrderByCreatedAtDesc(long userId);
    long countByPostEntityPostId(long postId);
}
