package com.example.be_job_hunt.service;

import com.example.be_job_hunt.dto.PostDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface PostService {
    PostDto createPost(PostDto postDto);
    List<PostDto> getAllPost();
}
