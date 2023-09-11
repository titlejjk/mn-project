package com.project.party.post.controller;

import com.project.party.post.dto.PostDto;
import com.project.party.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@RestController
@RequestMapping("/party")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @Value("${file.location}")
    private String imgPath;
    @GetMapping(
            value = "/image/{imageUrl}",
            produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_GIF_VALUE})
    @ResponseBody
    public byte[] getPostImage(@PathVariable("imageUrl") String imgName) throws IOException {
        String absolutePath = imgPath + File.separator + imgName;
        InputStream is = new FileInputStream(absolutePath);
        return IOUtils.toByteArray(is);
    }

    //게시글 등록
    @PostMapping("/insert")
    public ResponseEntity<?> createPost(@ModelAttribute PostDto postDto,
                                        @RequestParam("image") MultipartFile image) {
        try{
            //게시글 내용 저장
            postService.insertPost(postDto);
            //이미지 저장
            postService.insertImage(image, postDto.getPostId());
            return new ResponseEntity<>("Insert Complete!", HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>("Failed to Insert", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //게시글 목록 조회
    @GetMapping("/list")
    public ResponseEntity<List<PostDto>> getAllPosts() {
        return ResponseEntity.ok(postService.getList());
    }

    //게시글 상세 조회
    @GetMapping("/{postId}")
    public ResponseEntity<PostDto> getPost(@PathVariable int postId) {
        PostDto postDto = postService.getDetail(postId);
        postService.incrementViewCount(postId); // 조회수 증가
        return ResponseEntity.ok(postDto);
    }

    //게시글 수정
    @PostMapping("/update")
    public ResponseEntity<Void> updatePost(@ModelAttribute PostDto postDto) {
        postService.updatePost(postDto, postDto.getImage());
        return ResponseEntity.ok().build();
    }

    //게시글 삭제
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable int postId) {
        postService.deletePost(postId);
        return ResponseEntity.ok().build();
    }

    //나의 글 목록 조회
    @GetMapping("/myList/{userNum}")
    public ResponseEntity<List<PostDto>> getMyList(@PathVariable int userNum){

        return ResponseEntity.ok(postService.getMyList(userNum));
    }

    //사용자 번호로 게시물 번호 조회
    @GetMapping("/postId/{userNum}")
    public ResponseEntity<List<Integer>> getPostId(@PathVariable int userNum){
        return ResponseEntity.ok(postService.getPostId(userNum));
    }

}
