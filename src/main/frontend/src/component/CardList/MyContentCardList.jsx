import React, { useState, useEffect } from 'react';
import './MyContentCardList.css';
import jwt_decode from "jwt-decode";
import MyPageCard from "./MyPageCard";
import axios from "axios";
import Pagination from "../../lib/Pagination.jsx";
import { Link } from "react-router-dom";

const MyContentCardList = () => {
  const [cards, setCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecipeCount, setTotalRecipeCount] = useState(0);
  const cardsPerPage = 9;
  const userToken = localStorage.getItem("login-token");
  const [activeButton, setActiveButton] = useState("my-recipe-button");

  useEffect(() => {
    if (userToken) {
      const decodedToken = jwt_decode(userToken);

      if (decodedToken && decodedToken.userNum) {
        const userNum = decodedToken.userNum;

        axios
          .get(`/recipe/myList?userNum=${userNum}`)
          .then((response) => {
            console.log(response.data);
            setCards(response.data);
            setTotalRecipeCount(response.data.length);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      } else {
        console.error("토큰에서 userNum 정보를 찾을 수 없습니다.");
      }
    }
  }, [currentPage]);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

  const offset = currentPage * cardsPerPage;
  const currentCards = cards.slice(offset, offset + cardsPerPage);

  const handleButtonClick = (buttonType) => {
    // 버튼 클릭 로직 추가
  };

  return (
    <div className="my-page-card-list container">
      <div className="my-page-list-top">
        <div>
          <button
            className={`my-recipe-button ${
              activeButton === "my-recipe-button" ? "active" : ""
            }`}
            onClick={() => handleButtonClick("my-recipe-button")}
          >
            레시피
          </button>
          <button
            className={`my-party-button ${
              activeButton === "my-party-button" ? "active" : ""
            }`}
            onClick={() => handleButtonClick("my-party-button")}
          >
            축하파티
          </button>
        </div>
        <p className="my-page-list-total-count">전체 {totalRecipeCount} 개 </p>
      </div>
      <div className="my-page-card-list">
        {Array.isArray(currentCards) &&
          currentCards.map((card, index) => (
            <MyPageCard key={index} card={card} showTitle={true} />
          ))}
      </div>
      <Pagination
        pageCount={Math.ceil(cards.length / cardsPerPage)}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default MyContentCardList;