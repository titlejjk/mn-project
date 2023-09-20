package com.project.party.comment.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {
    private int commentId; //댓글 번호
    private int postId; //게시글 번호
    private int userNum; //작성자 번호
    private String content; //댓글 내용
    private String userNickname; //댓글 작성자
    private String userProfile; //댓글 작성자 프로필
    private String deleted; //댓글 삭제 여부('yes' or 'no')
    private String createdAt; //댓글 작성일
    private String updatedAt; //댓글 수정일

}