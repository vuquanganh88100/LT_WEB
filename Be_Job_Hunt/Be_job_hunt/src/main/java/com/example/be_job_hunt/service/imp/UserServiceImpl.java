package com.example.be_job_hunt.service.imp;

import com.example.be_job_hunt.dto.UserDto;
import com.example.be_job_hunt.entity.RoleEntity;
import com.example.be_job_hunt.entity.UserEntity;
import com.example.be_job_hunt.entity.UserRole;
import com.example.be_job_hunt.exception.DuplicateException;
import com.example.be_job_hunt.mapper.UserMapper;
import com.example.be_job_hunt.repository.RoleRepository;
import com.example.be_job_hunt.repository.UserRepository;
import com.example.be_job_hunt.repository.UserRoleRepository;
import com.example.be_job_hunt.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    UserMapper userMapper;
    @Autowired
     UserRepository userRepository;
    @Autowired
    UserRoleRepository userRoleRepository;
    @Autowired
    RoleRepository roleRepository;
    @Override
    public UserEntity createUser(UserDto userDto) throws DuplicateException {
        validateBeforeCreateUser(userDto);
        UserEntity userEntity=userMapper.toEntity(userDto);
        userEntity.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
        List<UserRole> userRoleList=new ArrayList<>();
        for(Long roleID: userDto.getRole()){
            RoleEntity role=roleRepository.findById(roleID).get();
            UserRole userRole=new UserRole();
            userRole.setRole(role);
            userRole.setUser(userEntity);
            userRoleList.add(userRole);
        }
        userEntity.setUserRoles(userRoleList);
        userRepository.save(userEntity);
        return  userEntity;
    }

    @Override
    public void validateBeforeCreateUser(UserDto userDto) throws DuplicateException {
        if(userRepository.existsByUserName(userDto.getUserName())){
            throw new DuplicateException("User name đã tồn tại");
        }else if(userRepository.existsByEmail(userDto.getEmail())){
            throw new DuplicateException("Email đã tồn tại");
        }
    }

}
