package com.project.party.likes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

//좋아요 관련 데이터 전송 객체
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LikesDto {

    private int likeId; //좋아요 ID
    private int postId; //게시글 ID
    private int userNumtedAt; //좋아요 생성 시인
    private int likeCou; //사용자 ID
    private String creant;  //좋아요 개수

}
