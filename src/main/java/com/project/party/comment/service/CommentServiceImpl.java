package com.project.party.comment.service;

import com.project.party.comment.dao.CommentMapper;
import com.project.party.comment.dto.CommentDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService{

    private final CommentMapper commentMapper;

    //댓글 생성
    @Override
    public void insertComment(CommentDto commentDto) {
        commentMapper.insertComment(commentDto);
    }

    //댓글 수정
    @Override
    public void updateComment(CommentDto commentDto) {
        commentMapper.updateComment(commentDto);
    }

    //댓글 삭제
    @Override
    public void deleteComment(int commentId) {
        commentMapper.deleteComment(commentId);
    }

    //게시글에 대한 댓글 조회
    @Override
    public List<CommentDto> getCommentsByPostId(int postId) {
        return commentMapper.selectCommentsByPostId(postId);
    }

    //나의 댓글 조회
    @Override
    public List<CommentDto> getMyRplList(int userNum, int postId) {
        CommentDto dto = new CommentDto();
        dto.setUserNum(userNum);
        dto.setPostId(postId);
        List<CommentDto> myRplList = commentMapper.getMyRplList(dto);
        return myRplList;
    }


}
