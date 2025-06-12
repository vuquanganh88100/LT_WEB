package com.example.be_job_hunt.repository;

import com.example.be_job_hunt.entity.DepartmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepartmentRepository extends JpaRepository<DepartmentEntity,Integer> {
    @Query("SELECT d FROM DepartmentEntity d WHERE d.name = :name AND d.department_id != :id")
    List<DepartmentEntity> findByNameExcludingId(@Param("name") String name, @Param("id") int id);
    @Query("SELECT s.department FROM SubjectEntity s WHERE s.id = :subjectId")
    DepartmentEntity findDepartmentBySubjectId(@Param("subjectId") Long subjectId);

}
