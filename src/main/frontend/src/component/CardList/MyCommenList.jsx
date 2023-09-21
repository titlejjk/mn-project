import React, { useState, useEffect } from 'react';
import './MyComment.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const MyCommentList = () => {
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

                  axios.get(`/recipe/reply/myRplList/${userNum}`)
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

                  axios.get(`http://localhost:9999/party/comment/myCommentList/${userNum}`)
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
    <div className='my-comment-card-list container'>
      <div className='my-comment-list-top'>
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
       <p className="my-comment-list-total-count">전체 {buttonType === 'recipe' ? totalRecipeCount : totalPartyCount} 개</p>
      </div>
      <div className={buttonType === 'recipe' ? 'my-comment-card-list' : 'my-ptcomment-card-list'}>
        {Array.isArray(currentCards) && currentCards.map((card, index) => (
          <div key={index} className='my-comment-card-item'>
            {buttonType === 'recipe' ? (
              <Link to={`/RecipeDetail?rcpNum=${card.rcpNum}`}>
              <div className='my-comment-content'>
              {card.rplContent}
              </div>
              <div className="my-comment-date">
              <span>{card.rplRegdate}</span>
              </div>
              </Link>
            ) : (
              <Link to={`/PartyDetail?postId=${card.postId}`}>
              <div className='my-comment-content'>
              {card.content}
              </div>
              <div className="my-comment-date">
              <span>{card.createdAt}</span>
              </div>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCommentList;