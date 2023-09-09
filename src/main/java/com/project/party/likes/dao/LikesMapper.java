package com.project.party.likes.dao;

import com.project.party.likes.dto.LikesDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface LikesMapper {

    void insertLike(LikesDto likesDto);
    void deleteLikeByUserAndPost(LikesDto likesDto);
    int countLikes(int postId);
    boolean isLikedByUser(LikesDto likesDto);
    List<LikesDto> orderByLike(LikesDto dto) ;

}