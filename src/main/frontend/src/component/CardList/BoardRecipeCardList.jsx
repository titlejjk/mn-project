import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '../../lib/Pagination.jsx';
import RecipeCard from './RecipeCard'; // RecipeCard 컴포넌트 임포트
import { Link } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import ReactPaginate from "react-paginate";
import '../../lib/Pagination.css';

const BoardRecipeCardList = () => {
    //const [cards, setCards] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecipeCount, setTotalRecipeCount] = useState(0);
    const cardsPerPage = 6;

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
                    `http://localhost:9999/recipe/list?userNum=${userNum}&pageNum=${currentPage}&pageSize=${cardsPerPage}`
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


    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage + 1);
    };

    return (
        <div className='board-card-list container'>
            <div className='board-list-top'>
                <p className='list-total-count'>전체 {totalRecipeCount} 개</p>
                <Link to='/recipeWrite' className='write-go'>
                    글작성
                </Link>
            </div>
            <div className='card-list'>
                {
                    pageInfo.contents.map((card, index) => (
                        <RecipeCard
                            key={index}
                            card={card}
                            showTitle={true}
                            showLikeBox={true}
                            rcpNum={card.rcpNum}
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

// 페이징 처리에서 next function
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

export default BoardRecipeCardList;