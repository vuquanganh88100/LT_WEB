package com.example.be_job_hunt.service;

import com.example.be_job_hunt.dto.UserDto;
import com.example.be_job_hunt.entity.UserEntity;
import com.example.be_job_hunt.exception.DuplicateException;
import org.springframework.stereotype.Service;

@Service
public interface UserService {
    UserEntity createUser(UserDto userDto) throws DuplicateException;
    void validateBeforeCreateUser(UserDto userDto) throws DuplicateException;



}
