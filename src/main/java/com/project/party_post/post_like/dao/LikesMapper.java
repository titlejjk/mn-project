package com.project.party_post.post_like.dao;

import com.project.party_post.post_like.dto.LikesDto;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LikesMapper {

    void insertLike(LikesDto likesDto);
    void deleteLikeByUserAndPost(int userNum, int postId);
    int countLikesByPostId(int postId);
    boolean isLikedByUser(int userNum, int postId);

}