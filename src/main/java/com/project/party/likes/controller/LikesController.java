package com.project.party.likes.controller;

import com.project.party.likes.dto.LikesDto;
import com.project.party.likes.service.LikesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/party/likes")
@RequiredArgsConstructor
public class LikesController {

    private final LikesService likesService;

    //좋아요 토글
    @PostMapping("/toggle")
    public ResponseEntity<String> toggleLike(@RequestBody LikesDto likesDto) {
        String message = likesService.toggleLike(likesDto);
        return ResponseEntity.ok(message);
    }

    //좋아요 개수
    @GetMapping("/count/{postId}")
    public ResponseEntity<Integer> countLikes(@PathVariable int postId) {
        int count = likesService.countLikes(postId);
        return ResponseEntity.ok(count);
    }

    //좋아요 여부
    @GetMapping("/isLiked")
    public ResponseEntity<Boolean> isLikedByUser(@RequestBody LikesDto likesDto) {
        boolean isLiked = likesService.isLikedByUser(likesDto);
        return ResponseEntity.ok(isLiked);
    }

    //좋아요 순위
    @GetMapping("/order")
    public ResponseEntity<?> orderByLike(){
        List<LikesDto> result = likesService.orderByLike();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
