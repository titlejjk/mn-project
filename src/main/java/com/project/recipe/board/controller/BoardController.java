package com.project.recipe.board.controller;

import com.project.recipe.board.dto.BoardDto;
import com.project.recipe.board.service.BoardService;
import com.project.recipe.image.sub.service.SubImgService;
import com.project.recipe.like.dto.LikeDto;
import com.project.recipe.like.service.LikeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.apache.commons.io.IOUtils;
import org.apache.tomcat.util.http.fileupload.impl.IOFileUploadException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.AutoConfigureOrder;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import java.util.List;


@Slf4j
@RestController
@RequestMapping("/recipe")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService rcpService;
    private final SubImgService subImgService;
    private final LikeService likeService;

    @Value("${file.location}")
    private String imgPath;

    @GetMapping(
            value = "/image/{imagePath}",
            produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_GIF_VALUE})
    @ResponseBody
    public byte[] getRcpMainImage(@PathVariable("imagePath") String imgName) throws IOException {
        String absolutePath = imgPath + File.separator + imgName;
        InputStream is = new FileInputStream(absolutePath);
        return IOUtils.toByteArray(is);
    }


    //게시글 작성
    @PostMapping("/insert")
    @Transactional
    public ResponseEntity<?> insert(@ModelAttribute BoardDto dto,
                                    @RequestPart(value = "subImages", required = false) List<MultipartFile> subImages) {
        try {
            //게시글 내용 저장
            rcpService.saveContent(dto);
            //서브 이미지 저장
            subImgService.saveImg(dto.getRcpNum(), subImages);

            //저장 완료시 성공메시지 출력
            return new ResponseEntity<>("Insert Complete!", HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to Insert", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //게시글 수정
    @PostMapping("/update")
    public ResponseEntity<?> update(@ModelAttribute BoardDto dto,
                                    @RequestParam("subImages") List<MultipartFile> subImages) {
        try {
            //게시글 내용 수정
            rcpService.updateContent(dto, subImages);
            return new ResponseEntity<>("Update Complete!", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Update Failed!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    //게시글 삭제
    @DeleteMapping("/delete")
    public ResponseEntity<?> delete(@RequestParam int rcpNum) {
        //게시글 번호로 해당 게시글 삭제
        rcpService.deleteContent(rcpNum);
        return new ResponseEntity<>("Delete Complete!", HttpStatus.OK);
    }

    //전체 게시글 목록
    @GetMapping("/list")
    public List<BoardDto> getList(@RequestParam(defaultValue = "1") int pageNum,
                                  @RequestParam(name = "keyword", required = false) String keyword,
                                  @RequestParam(name = "condition", required = false) String condition,
                                  @RequestParam(required = false) Integer userNum) {
        List<BoardDto> boardList;
        if (userNum == null) {
            boardList = rcpService.getList(pageNum, keyword, condition);
            boardList.forEach(board -> board.setLiked(0));
        }else{
            boardList = rcpService.getListWithLikes(keyword, condition, userNum);
        }
        //각 게시물에 대해 해당 사용자가 좋아요를 눌렀는지 확인하고 결과를 추가함
        return boardList;
    }

    //게시글 상세
    @GetMapping("/detail")
    public BoardDto getDetail(@RequestParam int rcpNum) {
        return rcpService.getDetail(rcpNum);
    }

    //나의 게시글 목록
    @GetMapping("/myList")
    public List<BoardDto> getMyList(@RequestParam int userNum) {
        return rcpService.getMyList(userNum);
    }

    //카테고리 별 게시글 목록
    @GetMapping("/petList")
    public List<BoardDto> getByCategory(@RequestParam int petNum) {
        return rcpService.getByCategory(petNum);
    }

}
