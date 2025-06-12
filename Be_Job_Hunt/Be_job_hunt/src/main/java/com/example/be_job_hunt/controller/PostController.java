package com.example.be_job_hunt.controller;

import com.example.be_job_hunt.dto.DepartmentDto;
import com.example.be_job_hunt.dto.PostDto;
import com.example.be_job_hunt.service.PostService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/blog/api/post")
@NoArgsConstructor
public class PostController {
    @Autowired
    PostService postService;
    @PostMapping
    public ResponseEntity<PostDto> createPost(@RequestBody PostDto postDto){
        return ResponseEntity.status(HttpStatus.CREATED).body(postService.createPost(postDto));
    }
    @GetMapping
    public ResponseEntity<List<PostDto>> getAll(){
        return  ResponseEntity.ok(postService.getAllPost());
    }
    @PostMapping("/update-status")
    public ResponseEntity<String>updateStatus(
            @RequestParam("status")String status,
            @RequestParam("postId") int postId
    ){
        postService.updateStatus(postId,status);
        return ResponseEntity.status(HttpStatus.CREATED).body("Update status thành công ");
    }
}
