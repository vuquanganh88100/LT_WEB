package com.example.be_job_hunt.service.imp;

import com.example.be_job_hunt.dto.PostDto;
import com.example.be_job_hunt.entity.DocumentEntity;
import com.example.be_job_hunt.entity.PostEntity;
import com.example.be_job_hunt.entity.Status;
import com.example.be_job_hunt.mapper.PostMapper;
import com.example.be_job_hunt.repository.PostRepository;
import com.example.be_job_hunt.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PostServiceImpl implements PostService {
@Autowired
    PostRepository postRepository;
@Autowired
    PostMapper postMapper;
    @Override
    public PostDto createPost(PostDto postDto) {
        PostEntity postSaved=postRepository.save(postMapper.toEntity(postDto));
        return postMapper.toDto(postSaved);
    }

    @Override
    public List<PostDto> getAllPost() {
        List<PostEntity>entities=postRepository.findAll();
        List<PostDto>postDtos=new ArrayList<>();
        for(PostEntity postEntity:entities){
            PostDto postDto=postMapper.toDto(postEntity);
            postDtos.add(postDto);
        }
        postDtos.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
        return  postDtos;
    }

    @Override
    public void updateStatus(long postId, String status) {
        PostEntity postEntity=postRepository.findById(Long.valueOf(postId)).get();
        postEntity.setStatus(Status.valueOf(status));
        postRepository.save(postEntity);
    }
}
