package com.example.be_job_hunt.mapper;

import com.example.be_job_hunt.dto.CommentDto;
import com.example.be_job_hunt.entity.CommentEntity;
import com.example.be_job_hunt.repository.PostRepository;
import com.example.be_job_hunt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class CommentMapper {
    @Autowired
    PostRepository postRepository;
    @Autowired
    UserRepository userRepository;
    
    public CommentDto toDto(CommentEntity commentEntity){
        CommentDto commentDto = new CommentDto();
        commentDto.setId(commentEntity.getId());
        commentDto.setContent(commentEntity.getContent());
        commentDto.setPostId(commentEntity.getPostEntity().getPostId());
        commentDto.setUserId(commentEntity.getUser().getId());
        commentDto.setCreatedAt(commentEntity.getCreatedAt());
        return commentDto;
    }

    public CommentEntity toEntity(CommentDto commentDto){
        CommentEntity commentEntity = new CommentEntity();
        commentEntity.setContent(commentDto.getContent());
        commentEntity.setPostEntity(postRepository.getByPostId(commentDto.getPostId()));
        commentEntity.setUser(userRepository.findById(commentDto.getUserId()).orElse(null));
        commentEntity.setCreatedAt(LocalDateTime.now());
        return commentEntity;
    }
    
    public void updateEntity(CommentEntity commentEntity, CommentDto commentDto) {
        commentEntity.setContent(commentDto.getContent());
    }
}
