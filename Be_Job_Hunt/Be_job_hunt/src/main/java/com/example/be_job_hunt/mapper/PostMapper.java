package com.example.be_job_hunt.mapper;

import com.example.be_job_hunt.dto.PostDto;
import com.example.be_job_hunt.entity.PostEntity;
import com.example.be_job_hunt.entity.Status;
import com.example.be_job_hunt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class PostMapper {
    @Autowired
    UserRepository userRepository;
    public PostEntity toEntity(PostDto dto){
        PostEntity postEntity=new PostEntity();
        postEntity.setTitle(dto.getTitle());
        postEntity.setContent(dto.getContent());
        postEntity.setStatus(Status.valueOf(dto.getStatus()));
        postEntity.setCreatedAt(LocalDateTime.now());
        postEntity.setUser(userRepository.findById(dto.getAuthorId()).get());
        return postEntity;
    }
    public PostDto toDto(PostEntity entity) {
        PostDto dto = new PostDto();
        dto.setPostId(entity.getPostId());
        dto.setTitle(entity.getTitle());
        dto.setContent(entity.getContent());
        dto.setStatus(entity.getStatus().name());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setAuthorId(entity.getUser().getId());
        dto.setAuthorName(entity.getUser().getUserName());
        return dto;
    }

}
