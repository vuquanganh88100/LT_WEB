package com.example.be_job_hunt.repository;

import com.example.be_job_hunt.entity.SubjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<SubjectEntity,Integer> {
    @Query("SELECT s FROM SubjectEntity s WHERE s.department.department_id = :deptId")
    List<SubjectEntity> findByDepartmentId(@Param("deptId") int departmentId);
}
