package com.example.be_job_hunt.service;

import com.example.be_job_hunt.dto.CommentDto;
import com.example.be_job_hunt.exception.NotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

public interface CommentService {
    CommentDto createComment(CommentDto commentDto) throws NotFoundException;
    CommentDto updateComment(long id, CommentDto commentDto) throws NotFoundException;
    void deleteComment(long id) throws NotFoundException;
    List<CommentDto> getCommentsByPostId(long postId);
}
