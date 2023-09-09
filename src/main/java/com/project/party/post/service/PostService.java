package com.project.party.post.service;

import com.project.party.post.dto.PostDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PostService {
    //게시글 생성
    void insertPost(PostDto postDto);
    //전체 게시글 조회
    List<PostDto> getList();
    //하나의 게시글을 조회
    PostDto getDetail(int postId);
    //게시글 수정
    void updatePost(PostDto postDto, MultipartFile image);
    //게시글 삭제
    void deletePost(int postId);
    //이미지 업로드 메서드
    void insertImage(MultipartFile image, int postId);
    //이미지 삭제 메서드
    void deleteImagesByPostId(int postId);
    //게시글 ID로 게시글 정보를 가져오며, 조회수를 1 증가
    void incrementViewCount(int postId);
    //나의 글 목록 조회
    List<PostDto> getMyList(int userNum);
    //사용자 번호로 게시글 번호 조회
    List<Integer> getPostId(int userNum);
}
