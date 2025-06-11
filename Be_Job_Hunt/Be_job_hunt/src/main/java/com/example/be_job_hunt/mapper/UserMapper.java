package com.example.be_job_hunt.mapper;

import com.example.be_job_hunt.dto.UserDto;
import com.example.be_job_hunt.entity.UserEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class UserMapper {
    public UserDto toDto(UserEntity user) {
        UserDto userDto = new UserDto();
        userDto.setGender(user.getGender());
        userDto.setEmail(user.getEmail());
        userDto.setUserName(user.getUserName());
        List<Long> roles = user.getUserRoles().stream()
                .map(role -> role.getRole().getId())
                .collect(Collectors.toList());
        userDto.setRole(roles);
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        return userDto;
    }

    public UserEntity toEntity(UserDto userDto) {
        UserEntity userEntity = new UserEntity();
        userEntity.setGender(userDto.getGender());
        userEntity.setEmail(userDto.getEmail());
        userEntity.setUserName(userDto.getUserName());
        userEntity.setFirstName(userDto.getFirstName());
        userEntity.setLastName(userDto.getLastName());
        String hash = BCrypt.hashpw(userDto.getPassword(), BCrypt.gensalt(12));
        userEntity.setPassword(hash);
        return userEntity;
    }
}
