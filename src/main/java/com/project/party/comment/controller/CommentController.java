package com.project.party.comment.controller;

import com.project.party.comment.dto.CommentDto;
import com.project.party.comment.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/party/comment")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    //댓글 등록
    @PostMapping("/insert")
    public ResponseEntity<Void> createComment(@RequestBody CommentDto commentDto) {
        commentService.insertComment(commentDto);
        return ResponseEntity.ok().build();
    }

    //댓글 수정
    @PostMapping("/update")
    public ResponseEntity<Void> updateComment(@RequestBody CommentDto commentDto) {
        commentService.updateComment(commentDto);
        return ResponseEntity.ok().build();
    }

    //댓글 삭제
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteComment(@RequestParam int commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.ok().build();
    }

    //게시글 댓글 목록 조회
    @GetMapping("/rplList/{postId}")
    public ResponseEntity<List<CommentDto>> getCommentsByPostId(@PathVariable int postId) {
        return ResponseEntity.ok(commentService.getCommentsByPostId(postId));
    }

    //나의 댓글 목록 조회
    @GetMapping("/myRplList/{userNum}/{postId}")
    public ResponseEntity<List<CommentDto>> getMyRplList(@PathVariable int userNum, @PathVariable int postId){
        return ResponseEntity.ok(commentService.getMyRplList(userNum, postId));
    }
}