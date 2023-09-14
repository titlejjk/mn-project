package com.project.party.comment.service;

import com.project.party.comment.dto.CommentDto;

import java.util.List;

public interface CommentService {
    //댓글 생성
    void insertComment(CommentDto commentDto);
    //댓글 수정
    void updateComment(CommentDto commentDto);
    //댓글 삭제
    void deleteComment(int commentId);
    //하나의 게시물의 대한 댓글 조회
    List<CommentDto> getCommentsByPostId(int postId);
    //나의 댓글 조회
    List<CommentDto> getMyRplList(int userNum, int postId);
}
