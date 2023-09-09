package com.project.recipe.reply.service;

import com.project.recipe.reply.dao.ReplyMapper;
import com.project.recipe.reply.dto.ReplyDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReplyServiceImpl implements ReplyService{

    @Autowired
    private ReplyMapper rplMapper;

    //파일 업로드 경로
    @Value("${file.location}")
    private String imgPath;

    @Override
    public void saveReply(ReplyDto dto) {
        rplMapper.insertRpl(dto);
    }

    @Override
    public void updateReply(ReplyDto dto) {
        rplMapper.updateRpl(dto);
    }

    @Override
    public void deleteReply(int rplNum) {
        rplMapper.deleteRpl(rplNum);
    }

    @Override
    public List<ReplyDto> getRplList(int rcpNum) {
        //Dto객체에 시작과 끝 인덱스를 설정
        ReplyDto dto = new ReplyDto();
        dto.setRcpNum(rcpNum);
        //해당 게시글 번호에 대한 댓글 목록 조회
        List<ReplyDto> rplList = rplMapper.getRplList(dto);
        //댓글 목록 반환
        return rplList;
    }

    @Override
    public List<ReplyDto> getMyRplList(int userNum, int rcpNum) {
        //dto 객체에 사용자로부터 받은 userNum과 rcpNum을 저장시킴
        ReplyDto dto = new ReplyDto();
        dto.setUserNum(userNum);
        dto.setRcpNum(rcpNum);
        //특정 사용자가 작성한 댓글에 대한 게시글 목록을 조회
        List<ReplyDto> myRplList = rplMapper.getMyRplList(dto);
        //나의 댓글 목록 반환
        return myRplList;
    }
}
