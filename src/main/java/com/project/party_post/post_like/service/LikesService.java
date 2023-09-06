package com.project.party_post.post_like.service;

import com.project.party_post.post_like.dto.LikesDto;

public interface LikesService {

    String toggleLike(LikesDto likesDto);
    int countLikesByPostId(int postId);
    boolean isLikedByUser(int userNum, int postId);

}
