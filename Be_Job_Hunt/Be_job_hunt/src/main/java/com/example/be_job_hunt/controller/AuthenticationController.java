package com.example.be_job_hunt.controller;

import com.example.be_job_hunt.dto.AuthRequest;
import com.example.be_job_hunt.dto.AuthResponse;
import com.example.be_job_hunt.dto.ErrorResponse;
import com.example.be_job_hunt.dto.UserDto;
import com.example.be_job_hunt.entity.UserEntity;
import com.example.be_job_hunt.exception.DuplicateException;
import com.example.be_job_hunt.mapper.UserMapper;
import com.example.be_job_hunt.repository.UserRepository;
import com.example.be_job_hunt.security.JwtUtil;
import com.example.be_job_hunt.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/blog/api/auth")
public class AuthenticationController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    UserRepository userRepository;
    @Autowired
    UserMapper userMapper;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
            final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
            final String jwt = jwtUtil.generateToken(userDetails);

            UserEntity userEntity = userRepository.findByUserName(request.getUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            UserDto userDto = userMapper.toDto(userEntity);

            return ResponseEntity.ok(new AuthResponse(jwt, userDto));
            
        } catch (UsernameNotFoundException e) {
            ErrorResponse errorResponse = new ErrorResponse(
                "Tên đăng nhập không tồn tại", 
                HttpStatus.UNAUTHORIZED.value(),
                LocalDateTime.now()
            );
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            
        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse(
                "Thông tin đăng nhập không chính xác", 
                HttpStatus.UNAUTHORIZED.value(),
                LocalDateTime.now()
            );
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @Autowired
    private UserService userService;

    @PostMapping("/save")
    public ResponseEntity<?> createUser(@Valid @RequestBody UserDto userDto, BindingResult bindingResult) throws DuplicateException {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors());
        }
        UserEntity user = userService.createUser(userDto);
        return ResponseEntity.status(HttpStatus.CREATED).body("created successfully");
    }
}
