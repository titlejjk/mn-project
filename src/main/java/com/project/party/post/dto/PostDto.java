package com.project.party.post.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;


@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostDto {

    private int postId; //게시글 ID
    private int userNum; //작성자 ID
    private String title; //게시글 제목
    private String content; //게시글 내용
    private String createdAt;  // 게시물 생성 날짜
    private String updatedAt;  // 게시물 수정 날짜
    private int viewCount; //조회수 필드
    private MultipartFile image;  //이미지 처리
    private String imageUrl;  //이미지 경로

}
