package com.project.recipe.like.controller;

import ch.qos.logback.core.net.SyslogOutputStream;
import com.project.recipe.like.dto.LikeDto;
import com.project.recipe.like.service.LikeService;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@RestController
@RequestMapping("/recipe/like")
public class LikeController {
    @Autowired
    private LikeService likesService;

    @Value("${file.location}")
    private String imgPath;
    @GetMapping(
            value = "/image/{mainPath}",
            produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_GIF_VALUE})
    @ResponseBody
    public byte[] getPostImage(@PathVariable("mainPath") String imgName) throws IOException {
        String absolutePath = imgPath + File.separator + imgName;
        InputStream is = new FileInputStream(absolutePath);
        return IOUtils.toByteArray(is);
    }

    //좋아요 토글
    @Transactional
    @PostMapping("/toggle")
    public ResponseEntity<String> toogleLike(@RequestBody LikeDto dto){
        String result = likesService.toogleLike(dto);
        HttpStatus status = "Like Inserted".equals(result) ? HttpStatus.OK : HttpStatus.BAD_REQUEST ;
        return new ResponseEntity<>(result, status);
    }

    //좋아요 개수
    @GetMapping("/counted")
    public ResponseEntity<Integer> countedLike(@RequestParam int rcpNum){
        int result = likesService.countedLike(rcpNum);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    //좋아요 초기화 방지
    @GetMapping("/isLiked")
    public ResponseEntity<Boolean> isLikedByUser(@RequestBody LikeDto dto){
        boolean result = likesService.isLikedByUser(dto);
        HttpStatus status = result == true ? HttpStatus.OK : HttpStatus.NOT_FOUND;
        return new ResponseEntity<>(result, status);
    }

    //좋아요 순위별 조회
    @GetMapping("/order")
    public ResponseEntity<?> orderByLike(){
        List<LikeDto> result = likesService.orderByLike();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}