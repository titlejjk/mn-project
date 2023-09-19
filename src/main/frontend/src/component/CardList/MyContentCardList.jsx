import React, { useState, useEffect } from 'react';
import './MyContentCardList.css';
import jwt_decode from "jwt-decode";
import MyPageCard from './MyPageCard';
import MyPartyCard from './MyPartyCard';
import axios from 'axios';
import Pagination from '../../lib/Pagination.jsx';

const MyContentCardList = () => {
    const [recipeCards, setRecipeCards] = useState([]); // 레시피 데이터 저장
    const [partyCards, setPartyCards] = useState([]); // 축하파티 데이터 저장
    const [currentPage, setCurrentPage] = useState(0);
    const [totalRecipeCount, setTotalRecipeCount] = useState(0);
    const [totalPartyCount, setTotalPartyCount] = useState(0);
    const cardsPerPage = 9;
    const userToken = localStorage.getItem('login-token');
    const [buttonType, setButtonType] = useState('recipe');

    const fetchRecipeData = () => {
        if (userToken) {
            const decodedToken = jwt_decode(userToken);
            if (decodedToken && decodedToken.userNum) {
                const userNum = decodedToken.userNum;

                axios.get(`/recipe/myList?userNum=${userNum}`)
                    .then((response) => {
                        setRecipeCards(response.data);
                        setTotalRecipeCount(response.data.length);
                    })
                    .catch((error) => {
                        console.error('Error fetching recipe data:', error);
                    });
            } else {
                console.error('토큰에서 userNum 정보를 찾을 수 없습니다.');
            }
        }
    };

    const fetchPartyData = () => {
        if (userToken) {
            const decodedToken = jwt_decode(userToken);
            if (decodedToken && decodedToken.userNum) {
                const userNum = decodedToken.userNum;

                axios.get(`/party/myList/${userNum}`)
                    .then((response) => {
                        setPartyCards(response.data);
                        setTotalPartyCount(response.data.length);
                    })
                    .catch((error) => {
                        console.error('Error fetching party data:', error);
                    });
            } else {
                console.error('토큰에서 userNum 정보를 찾을 수 없습니다.');
            }
        }
    };

    useEffect(() => {
        if (buttonType === 'recipe') {
            fetchRecipeData();
        } else {
            fetchPartyData();
        }
    }, [buttonType]);

    const handleButtonClick = (type) => {
        setButtonType(type);
        setCurrentPage(0);
    };

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const offset = currentPage * cardsPerPage;
    const currentCards = buttonType === 'recipe' ? recipeCards.slice(offset, offset + cardsPerPage) : partyCards.slice(offset, offset + cardsPerPage);

    return (
        <div className="my-page-card-list container">
            <div className="my-page-list-top">
                <div>
                    <button
                        className={`my-recipe-button ${buttonType === 'recipe' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('recipe')}
                    >
                        레시피
                    </button>
                    <button
                        className={`my-party-button ${buttonType === 'party' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('party')}
                    >
                        축하파티
                    </button>
                </div>
                <p className="my-page-list-total-count">전체 {buttonType === 'recipe' ? totalRecipeCount : totalPartyCount} 개</p>
            </div>
            <div className="my-page-card-list">
                {currentCards.map((card, index) => (
                    <div key={index}>
                        {buttonType === 'recipe' ? (
                            <MyPageCard card={card} showTitle={true} />
                        ) : (
                            <MyPartyCard card={card} showTitle={true} />
                        )}
                    </div>
                ))}
            </div>
            <Pagination pageCount={Math.ceil(buttonType === 'recipe' ? totalRecipeCount / cardsPerPage : totalPartyCount / cardsPerPage)} onPageChange={handlePageChange} />
        </div>
    );
};

export default MyContentCardList;