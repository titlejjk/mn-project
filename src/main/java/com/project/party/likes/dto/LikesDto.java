package com.project.party.likes.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//좋아요 관련 데이터 전송 객체
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class LikesDto {

    private int likeId; //좋아요 ID
    private int postId; //게시글 ID
    private int userNum; //사용자 ID
    private String likeCountedAt; //좋아요 생성 일자
    private int likeCount;  //좋아요 개수

}
