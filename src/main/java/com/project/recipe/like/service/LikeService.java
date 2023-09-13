package com.project.recipe.like.service;

import com.project.recipe.like.dto.LikeDto;

import java.util.List;

public interface LikeService {
    //좋아요 토글
    String toggleLike(int rcpNum, int userNum);
    //좋아요 수
    int countedLike(int rcpNum);
    //좋아요 여부
    boolean isLikedByUser(int rcpNum, int userNum);
    //좋아요 순위
    List<LikeDto> orderByLike();
}
