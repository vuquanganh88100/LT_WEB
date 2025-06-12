package com.example.be_job_hunt.repository;

import com.example.be_job_hunt.entity.PostEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<PostEntity,Long> {
    PostEntity getByPostId(Long postId);

}
