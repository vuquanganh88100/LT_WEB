package com.example.be_job_hunt.service.imp;

import com.example.be_job_hunt.dto.CommentDto;
import com.example.be_job_hunt.entity.CommentEntity;
import com.example.be_job_hunt.exception.NotFoundException;
import com.example.be_job_hunt.mapper.CommentMapper;
import com.example.be_job_hunt.repository.CommentRepository;
import com.example.be_job_hunt.repository.PostRepository;
import com.example.be_job_hunt.repository.UserRepository;
import com.example.be_job_hunt.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {
    
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private CommentMapper commentMapper;
    @Override
    public CommentDto createComment(CommentDto commentDto) throws NotFoundException {
        CommentEntity commentEntity = commentMapper.toEntity(commentDto);
        CommentEntity savedComment = commentRepository.save(commentEntity);
        return commentMapper.toDto(savedComment);
    }
    @Override
    public CommentDto updateComment(long id, CommentDto commentDto) throws NotFoundException {
        CommentEntity existingComment = commentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Comment not found with id: " + id));
        
        commentMapper.updateEntity(existingComment, commentDto);
        CommentEntity updatedComment = commentRepository.save(existingComment);
        return commentMapper.toDto(updatedComment);
    }

    @Override
    public void deleteComment(long id) throws NotFoundException {
        if (!commentRepository.existsById(id)) {
            throw new NotFoundException("Comment not found with id: " + id);
        }
        commentRepository.deleteById(id);
    }

    @Override
    public List<CommentDto> getCommentsByPostId(long postId) {
        List<CommentEntity> comments = commentRepository.findByPostEntityPostIdOrderByCreatedAtDesc(postId);
        return comments.stream()
                .map(commentMapper::toDto)
                .collect(Collectors.toList());
    }
}
