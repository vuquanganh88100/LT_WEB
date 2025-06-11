package com.example.be_job_hunt.controller;

import com.example.be_job_hunt.dto.UserDto;
import com.example.be_job_hunt.entity.UserEntity;
import com.example.be_job_hunt.exception.DuplicateException;
import com.example.be_job_hunt.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/blog/api/users")
public class UserController {

    @PostMapping("test")
    public ResponseEntity<?>test(){
        return ResponseEntity.status(HttpStatus.OK).body("test");
    }
}
