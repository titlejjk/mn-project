import './NoticeDetail.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 백엔드와 연동할 데이터
const data = {
    category: "중요",
    title: "[시스템 점검 공지]  9/28(목)) 01:00~03:00 점검 예정",
    content: "안녕하세요 멍냥키친 관리자입니다.\n\n9/28(목) 새벽 1시부터 3시까지 시스템 점검이 있을 예정이니 일정에 참고해주시기 바랍니다.\n\n감사합니다.",
    createdAt:"2023.08.15"
}

// 페이지 로딩 시 출력되는 화면내용
export default function Page(){

    const [list, setList] = useState([]);

    // 현재 페이지의 URL을 가져옵니다.
    const currentURL = window.location.href;

    // URL에서 쿼리 문자열을 추출합니다.
    const queryString = currentURL.split('?')[1]; // ? 뒤의 쿼리 문자열을 추출합니다.

    // 쿼리 문자열을 파싱하여 객체로 변환합니다.
    const queryParams = {};
    if (queryString) {
      const queryParts = queryString.split('&');
      for (const part of queryParts) {
        const [key, value] = part.split('=');
        queryParams[key] = decodeURIComponent(value);
      }
    }

    // id 값을 추출합니다.
    const id = queryParams.id;

    const getList = ()=>{
      axios.get("http://localhost:9999/notice/list/"+id)
      .then(res=>{
        setList(res.data);
        console.log(res.data);
      })
      .catch(error=>{
        console.log(error);
      });
    }

    useEffect(()=>{
      getList();
    }, [])

    return (
        <main className="notice_detail_main">
            <div className="notice_detail_titlebox">
                <div>
                    <h2>공지사항</h2>
                </div>
                {/* 구분선 */}
                <Divider />
                <div className="notice_detail_title">
                    {/* 작성자 */}
                    <div>{list.writer}</div>
                    {/* 공지사항 제목 */}
                    <div>{list.title}</div>
                    {/* 공지사항 등록일 */}
                    <div>{list.createdDate}</div>
                </div>
            </div>
            <Divider />
            <div className="notice_detail_content">
                {/* 공지사항 내용 */}
                {list.content}
            </div>
            <Divider />
            <Link className="notice_detail_listbtn" to={"/Notice"}>목록</Link>
        </main>
    );
}

// 구분선
function Divider(){
    return <div className="notice_detail_divider" />;
}