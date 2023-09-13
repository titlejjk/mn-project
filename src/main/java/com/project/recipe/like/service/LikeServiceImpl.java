package com.project.recipe.like.service;

import com.project.recipe.like.dao.LikeMapper;
import com.project.recipe.like.dto.LikeDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LikeServiceImpl implements LikeService {
    @Autowired
    private LikeMapper likeMapper;

    //좋아요 토글 메소드
    @Override
    public String toggleLike(int rcpNum, int userNum) {
        if(likeMapper.isLikedByUser(rcpNum, userNum)){
            //이미 좋아요를 누른 경우, 좋아요 기록 삭제
            likeMapper.deleteLike(rcpNum, userNum);
            return "Like Deleted!";
        }else{
            //좋아요를 누르지 않은 경우, 좋아요 기록 저장
            likeMapper.insertLike(rcpNum, userNum);
            return "Like Inserted!";
        }
    }


    //좋아요 개수 반환 메소드
    @Override
    public int countedLike(int rcpNum) {
        return likeMapper.countedLike(rcpNum);
    }

    //좋아요 여부 반환 메소드 (초기화 방지)
    @Override
    public boolean isLikedByUser(int rcpNum, int userNum) {

        return likeMapper.isLikedByUser(rcpNum, userNum);
    }

    //좋아요 순위별 조회 메소드
    @Override
    public List<LikeDto> orderByLike() {
        LikeDto dto = new LikeDto();
        return likeMapper.orderByLike(dto);
    }

}
