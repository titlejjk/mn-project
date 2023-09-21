package com.project.recipe.like.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LikeDto {
    private int id; //좋아요 번호
    private int rcpNum;  //게시글 번호
    private int userNum;  //작성자 번호
    private int likeCount;  //좋아요 개수
    private String mainPath;  //메인이미지 경로
}
