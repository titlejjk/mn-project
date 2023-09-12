import axios from 'axios';
import React, { useEffect,useState} from 'react';
import './NoticeBoard.css';
import { Link } from 'react-router-dom';
import Pagination from "../../lib/Pagination";

const NoticeBoard = ({user}) => {
    const [posts, setPosts] = useState([]);
    
    const [isAdmin, setIsAdmin] = useState(false);


    const [currentPage, setCurrentPage] = useState(0);
    // 페이징 처리에 관련한 로직 및 상태 추가

    const [totalPostCount, setTotalPostCount] = useState(0);
    //전체 글의 개수를 표시

    const postPerPage = 8;
    //한 페이지에 표시할 카드의 수를 정의
    // 추가


    // user 정보에 따라 관리자 여부 확인
    // if (user && user.role === 'admin') {
    //     setIsAdmin(true);
    // }
      
        useEffect(() => {
          axios.get('/notice/list')
            .then(response => {
              setPosts(response.data);
              setTotalPostCount(response.data.length);
            })
            .catch(error => {
              console.error('Error fetching posts:', error);
            });
        }, []);



        //현재 페이지에 표시 되어야 할 카드의 시작 위치 계산
        //현재 페이지 * 한페이지에 표시할 카드 수 =  시작위치
        const offset = currentPage * postPerPage;

        //현재 페이지에 표시되어야 할 카드들의 배열 구성
        //cards 배열에서 offset ~ offeset+cardsperPages범위를 슬라이스해서 현재 페이지에 가져온다.
        const currentPosts = posts.slice(offset, offset + postPerPage);

        //페이지 변경을 처리하며, 현재 페이지에 맞게 표시할 카드들을 슬라이스하여 렌더링하는 함수
        const handlePageChange = (selectedPage) => {
            console.log("Selected page:", selectedPage); // 현재 페이지 로깅
            setCurrentPage(selectedPage);
        };


    return (
            <div className="notice-board container">
                <div className='notice-top'>

                <h1 className='notice-title'>공지사항</h1>
                    <p className='list-total-count'>전체 {totalPostCount} 개 </p>
              {/*   {isAdmin && <Link to="/noticeWrite" className='go-notice-write'>글작성</Link>} */}
                    {/* 관리자 계정으로 로그인했을경우 글작성 링크가 나온다. */}
                    
                    </div>
            <ul className="notice-list">
                {Array.isArray(currentPosts) && currentPosts.map(post => (
                <li className="notice-item" key={post.id}>
                    <Link to="/noticeDetail" className='post-title'>{post.title}</Link>
                      {/*    <p className='post-content'>{post.content}</p> */}

                      <p className='post-date'>{post.createdDate}</p>
                    
                </li>
              ))}
            </ul>
                <Pagination pageCount={Math.ceil(posts.length / postPerPage)} onPageChange={(data) => handlePageChange(data.selected)} />
          </div>
        );
    
};

export default NoticeBoard;