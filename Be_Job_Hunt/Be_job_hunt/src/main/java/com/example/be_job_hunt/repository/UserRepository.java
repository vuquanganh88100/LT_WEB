package com.example.be_job_hunt.repository;

import com.example.be_job_hunt.entity.UserEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<UserEntity, Long> {
    boolean existsByUserName(String userName);
    boolean existsByEmail(String email);
    @EntityGraph(attributePaths = "userRoles.role")
    Optional<UserEntity> findByUserName(String userName);
}

