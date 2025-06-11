package com.example.be_job_hunt.service.imp;

import com.example.be_job_hunt.dto.DepartmentDto;
import com.example.be_job_hunt.entity.DepartmentEntity;
import com.example.be_job_hunt.exception.DuplicateException;
import com.example.be_job_hunt.repository.DepartmentRepository;
import com.example.be_job_hunt.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DepartmentServiceImpl implements DepartmentService {
    @Autowired
    DepartmentRepository departmentRepository;
    
    @Override
    public List<DepartmentDto> getDepartment() {
        List<DepartmentEntity>departmentEntities=departmentRepository.findAll();
        List<DepartmentDto>departmentDtos=new ArrayList<>();
        for(DepartmentEntity departmentEntity:departmentEntities){
            DepartmentDto departmentDto =new DepartmentDto();
            departmentDto.setDepartmentId(departmentEntity.getDepartment_id());
            departmentDto.setName(departmentEntity.getName());
            departmentDtos.add(departmentDto);
        }
        return  departmentDtos;
    }

    @Override
    public DepartmentDto saveDepartment(DepartmentDto departmentDto) {
        DepartmentEntity departmentEntity=new DepartmentEntity();
        departmentEntity.setName(departmentDto.getName());
         departmentEntity=departmentRepository.save(departmentEntity);
         departmentDto.setDepartmentId(departmentEntity.getDepartment_id());
        return departmentDto;
    }
    
    @Override
    public DepartmentDto updateDepartment(int id, DepartmentDto departmentDto) throws DuplicateException {
        try {
            List<DepartmentEntity> duplicates = departmentRepository.findByNameExcludingId(
                departmentDto.getName(), id);
                
            if (!duplicates.isEmpty()) {
                throw new DuplicateException(
                    "Tên khoa '" + departmentDto.getName() + "' đã tồn tại trong hệ thống",
                    "DepartmentServiceImpl.updateDepartment",
                    "Duplicate name found in database: ID=" + duplicates.get(0).getDepartment_id()
                );
            }
            
            DepartmentEntity existingDepartment = departmentRepository.findById(id).get();
            existingDepartment.setName(departmentDto.getName());
            
            DepartmentEntity updatedDepartment = departmentRepository.save(existingDepartment);
            
            // Convert to DTO and return
            DepartmentDto updatedDto = new DepartmentDto();
            updatedDto.setDepartmentId(updatedDepartment.getDepartment_id());
            updatedDto.setName(updatedDepartment.getName());
            
            return updatedDto;
        } catch (DuplicateException de) {
            // Just rethrow the exception as it's already properly formed
            throw de;
        } catch (Exception e) {
            // Log the detailed error for debugging
            System.out.println("Error in updateDepartment: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
