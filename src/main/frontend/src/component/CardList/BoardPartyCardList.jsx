import React, { useState, useEffect} from 'react';
import './CardList.css';
import PartyCard from './PartyCard';
import axios from 'axios';
import Pagination from '../../lib/Pagination.jsx';
import { Link } from 'react-router-dom';
import jwt_decode from "jwt-decode";


const BoardPartyCardList = () => {
    const [cards, setCards] = useState([]);
    //초기값을 빈 배열로 설정

    const [currentPage, setCurrentPage] = useState(0);
    // 페이징 처리에 관련한 로직 및 상태 추가

    const [totalRecipeCount, setTotalRecipeCount] = useState(0);
    //전체 글의 개수를 표시

    const cardsPerPage = 6;
    //한 페이지에 표시할 카드의 수를 정의
    // 추가

    useEffect(() => {
        const newToken = localStorage.getItem('login-token');
        const userNum = newToken ? jwt_decode(newToken).userNum : null;
        // 사용자 토큰에서 userNum 추출, 없으면 null

        const apiUrl = userNum ? `http://localhost:9999/party/list?userNum=${userNum}` : 'http://localhost:9999/party/list';
        axios.get(apiUrl)
            .then(response => {
                setCards(response.data);
                setTotalRecipeCount(response.data.length); // 레시피 개수 설정
            })
            .catch(error => {
                // console.error('레시피 카드 리스트 Error fetching data:', error);
            });
    }, [])
    //axios로 json데이터 가져오기


    //현재 페이지에 표시 되어야 할 카드의 시작 위치 계산
    //현재 페이지 * 한페이지에 표시할 카드 수 =  시작위치
    const offset = currentPage * cardsPerPage;

    //현재 페이지에 표시되어야 할 카드들의 배열 구성
    //cards 배열에서 offset ~ offeset+cardsperPages범위를 슬라이스해서 현재 페이지에 가져온다.
    const currentCards = cards.slice(offset, offset + cardsPerPage);

    //페이지 변경을 처리하며, 현재 페이지에 맞게 표시할 카드들을 슬라이스하여 렌더링하는 함수
    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage);
    };

    return (
        <div className='board-card-list container'>
            <div className='board-list-top'>
                <p className='list-total-count'>전체 {totalRecipeCount} 개 </p>
                <Link to="/partyWrite" className='write-go'>글작성</Link>
            </div>
            <div className="card-list">
                {Array.isArray(currentCards) && currentCards.map((card, index) => (
                    <PartyCard key={index} card={card} showTitle={true} showLikeBox={true}/>
                ))}
            </div>
            <Pagination pageCount={Math.ceil(cards.length / cardsPerPage)} onPageChange={(data) => handlePageChange(data.selected)} />

        </div>
    );
};

export default BoardPartyCardList;
