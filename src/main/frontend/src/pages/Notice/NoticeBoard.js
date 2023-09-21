import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './NoticeBoard.css';
import { Link, useLocation } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const NoticeBoard = ({ tokenChanged }) => {
    const [posts, setPosts] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false); // 관리자 여부 상태 변수 추가

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


    useEffect(() => {
        axios
            .get('http://localhost:9999/notice/list')
            .then((response) => {
                setPosts(response.data);
            })
            .catch((error) => {
                console.error('Error fetching posts:', error);
            });
    }, []);

    return (
        <div className="notice-board container">
            <div className="notice-top">
                <h1 className="notice-title">공지사항</h1>
                {isAdmin && (
                    <Link to="/noticeWrite" className="go-notice-write">
                        글작성
                    </Link>
                )}
            </div>
            <ul className="notice-list">
                {posts.map((post) => (
                    <li className="notice-item" key={post.id}>
                        <Link to={`/noticedetail?id=${post.id}`} className="post-title">
                            {post.title}
                        </Link>
                        <p className="post-date">{post.createdDate}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NoticeBoard;