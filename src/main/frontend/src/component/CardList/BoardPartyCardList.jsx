import React, { useState, useEffect} from 'react';
import './CardList.css';
import PartyCard from './PartyCard';
import axios from 'axios';
import Pagination from '../../lib/Pagination.jsx';
import { Link } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import ReactPaginate from "react-paginate";
import RecipeCard from "./RecipeCard";

const BoardPartyCardList = () => {

    const [cards, setCards] = useState([]);
    //초기값을 빈 배열로 설정

    const [currentPage, setCurrentPage] = useState(1);
    // 페이징 처리에 관련한 로직 및 상태 추가

    const [totalRecipeCount, setTotalRecipeCount] = useState(0);
    //전체 글의 개수를 표시

    const cardsPerPage = 6;
    //한 페이지에 표시할 카드의 수를 정의
    // 추가

    const [pageInfo, setPageInfo]=useState({
        contents:[]
    });
    const [pageArray, setPageArray]=useState([]);
    function createArray(start, end){
        const result=[];
        for(let i=start; i<=end; i++){
            result.push(i);
        }
        return result;
    }

    useEffect(() => {
        const newToken = localStorage.getItem('login-token');
        const userNum = newToken ? jwt_decode(newToken).userNum : null;


        const fetchData = async () => {
        try {
            const response = await axios.get(
                `http://localhost:9999/party/list?userNum=${userNum}&pageNum=${currentPage}&pageSize=${cardsPerPage}`
            );
            const data = response.data;
            console.log("userNum : " , userNum)
            setPageInfo(data);
            setPageArray(createArray(data.startPageNum, data.endPageNum));
            setTotalRecipeCount(data.totalRow)
            console.log(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
}, [currentPage]);


    //현재 페이지에 표시 되어야 할 카드의 시작 위치 계산
    //현재 페이지 * 한페이지에 표시할 카드 수 =  시작위치
    const offset = currentPage * cardsPerPage;

    //현재 페이지에 표시되어야 할 카드들의 배열 구성
    //cards 배열에서 offset ~ offeset+cardsperPages범위를 슬라이스해서 현재 페이지에 가져온다.
    const currentCards = cards.slice(offset, offset + cardsPerPage);

    //페이지 변경을 처리하며, 현재 페이지에 맞게 표시할 카드들을 슬라이스하여 렌더링하는 함수
    const handlePageChange = (selectedPage) => {
        //console.log("Selected page:", selectedPage); // 현재 페이지 로깅
        setCurrentPage(selectedPage);
    };

    return (
        <div className='board-card-list container'>
            <div className='board-list-top'>
                <p className='list-total-count'>전체 {totalRecipeCount} 개 </p>
                <Link to="/partyWrite" className='write-go'>글작성</Link>
            </div>
            <div className='card-list'>
                {
                    pageInfo.contents.map((card, index) => (
                        <PartyCard
                            key={index}
                            card={card}
                            showTitle={true}
                            showLikeBox={true}
                            postId={card.postId}
                        />
                    ))}
            </div>
            <ReactPaginate
                pageCount={pageInfo.totalPageCount}
                pageRangeDisplayed={5}
                nextLabel={<Next />} // 다음 페이지로 가는 버튼의 value 값
                previousLabel={<Prev />}
                className="paginate"
                pageClassName="page-item"
                previousClassName="page-item"
                nextClassName="page-item"
                pageLinkClassName="page-link"
                previousLinkClassName="np"
                nextLinkClassName="np"
                onPageChange={(e)=>{
                    console.log(e.selected);
                    setCurrentPage(e.selected+1)
                }}/>
        </div>
    );
};

function Next() {
    return (
        <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill="#909090"
                d="M15.8 43.9L13 41.05L30.15 23.9L13 6.75002L15.8 3.90002L35.8 23.9L15.8 43.9Z"
            />
        </svg>
    );
}

// 페이징 처리에서 prev function
function Prev() {
    return (
        <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill="#909090"
                d="M33 44L13 24L33 4L35.8 6.85L18.65 24L35.8 41.15L33 44Z"
            />
        </svg>
    );
}

export default BoardPartyCardList;