import './NoticeDetail.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

// 페이지 로딩 시 출력되는 화면내용
export default function Page() {
    // NoticeDetail 페이지 조회 내용 담는 변수
    const [list, setList] = useState([]);
    // 관리자 여부 상태 변수 추가
    const [isAdmin, setIsAdmin] = useState(false);
    // 작성글 수정을 위한 useNavigate 선언
    const navigate = useNavigate();

    const location = useLocation();
    // URL 파라미터에서 이메일 값을 읽어와 email 상태에 설정
    useEffect(() => {
        // JWT 토큰을 가져옴
        const token = localStorage.getItem('login-token');

        // JWT 토큰이 있을 때
        if (token) {
            const decodedToken = jwt_decode(token);

            // user 정보에 따라 관리자 여부 확인
            if (decodedToken.roles === 'ADMIN') {
                setIsAdmin(true);
                console.log(decodedToken.roles);
            }
        }
    }, []);


    // 현재 페이지의 URL 가져오기
    const currentURL = window.location.href;
    // URL에서 쿼리 문자열 추출
    const queryString = currentURL.split('?')[1]; // ? 뒤의 쿼리 문자열을 추출합니다.
    // 쿼리 문자열을 파싱하여 객체로 변환
    const queryParams = {};
    if (queryString) {
        const queryParts = queryString.split('&');
        for (const part of queryParts) {
            const [key, value] = part.split('=');
            queryParams[key] = decodeURIComponent(value);
        }
    }
    // id 값 추출하여 변수에 담기
    const id = queryParams.id;

    // NoticeDetail 페이지 조회를 위한 axios 요청
    const getList = () => {
        axios.get("http://localhost:9999/notice/list/" + id)
            .then(res => {
                setList(res.data);
                console.log(res.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
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
            <div
                // 공지사항 내용
                className="notice_detail_content"
                dangerouslySetInnerHTML={{ __html: list.content }}
            />
            <Divider />
            {isAdmin ? (
                <div className="notice_detail_edit_container">
                    <button
                        onClick={() => {
                            navigate(`/noticeUpdate?id=${id}`);
                        }}
                    >
                        수정
                    </button>
                    <button
                        onClick={() => {
                            if (window.confirm("정말 삭제하시겠습니까?")) {
                                axios
                                    .get(
                                        `http://localhost:9999/notice/delete/${id}`
                                    )
                                    .then((res) => {
                                        alert("삭제 되었습니다.");
                                        navigate("/noticeBoard");
                                    })
                                    .catch((error) => {
                                        alert("삭제 중 오류가 발생하였습니다.");
                                    });
                            }
                        }}
                    >
                        삭제
                    </button>
                </div>
            ) : (
                ''
            )}
            {/* 목록으로 이동 */}
            <Link className="notice_detail_listbtn" to={"/NoticeBoard"}>목록</Link>
        </main>
    );
}

// 구분선
function Divider() {
    return <div className="notice_detail_divider" />;
}